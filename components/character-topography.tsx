"use client";

import { useEffect, useRef } from "react";

const INK = "#e7e2d6";
const GLYPHS = ["·", ":", "+", "×"];
const TONES = 32;
const TILE_SIZE = 18;
const FRAME_INTERVAL = 1000 / 30;
const YAW = -0.32;
const PITCH = 0.88;
const COS_YAW = Math.cos(YAW);
const SIN_YAW = Math.sin(YAW);
const COS_PITCH = Math.cos(PITCH);
const SIN_PITCH = Math.sin(PITCH);

type SurfacePoint = {
  x: number;
  z: number;
  sinA: number;
  cosA: number;
  sinB: number;
  cosB: number;
  sinC: number;
  cosC: number;
  lift: number;
  fade: number;
  glyph: number;
};

function smoothstep(low: number, high: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}

function createSurface(columns: number, rows: number) {
  const points: SurfacePoint[] = [];

  for (let row = 0; row < rows; row++) {
    const z = (row / (rows - 1) - 0.5) * 8;

    for (let column = 0; column < columns; column++) {
      const x = (column / (columns - 1) - 0.5) * 11;
      const a = x * 0.79 + z * 0.46;
      const b = z * 1.12 - x * 0.28;
      const c = x * 1.48 + z * 0.72;
      const edge = Math.max(Math.abs(x) / 5.5, Math.abs(z) / 4);
      const seed = (column * 17 + row * 31) % 29;

      points.push({
        x,
        z,
        sinA: Math.sin(a),
        cosA: Math.cos(a),
        sinB: Math.sin(b),
        cosB: Math.cos(b),
        sinC: Math.sin(c),
        cosC: Math.cos(c),
        lift: Math.exp(-((x + 0.8) ** 2 / 8 + (z - 0.3) ** 2 / 5)) * 0.8,
        fade: 1 - smoothstep(0.66, 1, edge),
        glyph: seed < 18 ? 0 : seed < 23 ? 1 : seed < 28 ? 2 : 3,
      });
    }
  }

  return points;
}

function createGlyphAtlas(pixelRatio: number, font: string) {
  const atlas = document.createElement("canvas");
  const size = TILE_SIZE * pixelRatio;
  atlas.width = Math.ceil(size * TONES);
  atlas.height = Math.ceil(size * GLYPHS.length);
  const context = atlas.getContext("2d");
  if (!context) return null;

  context.scale(pixelRatio, pixelRatio);
  context.font = `10px ${font}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = INK;

  for (let glyph = 0; glyph < GLYPHS.length; glyph++) {
    for (let tone = 0; tone < TONES; tone++) {
      context.globalAlpha = (tone + 1) / TONES;
      context.fillText(
        GLYPHS[glyph],
        tone * TILE_SIZE + TILE_SIZE / 2,
        glyph * TILE_SIZE + TILE_SIZE / 2,
      );
    }
  }

  return atlas;
}

function SurfacePoster() {
  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      className="topography-poster absolute inset-0 size-full"
      fill="none"
    >
      <g stroke={INK} strokeWidth="0.8" strokeDasharray="0.5 6" strokeLinecap="round">
        {Array.from({ length: 30 }, (_, row) => {
          const path = Array.from({ length: 80 }, (_, column) => {
            const x = (column / 79 - 0.5) * 10;
            const z = (row / 29 - 0.5) * 7;
            const height = Math.sin(x * 0.79 + z * 0.46) * 0.85 + Math.sin(z * 1.12 - x * 0.28) * 0.45;
            const screenX = 710 + (x * COS_YAW - z * SIN_YAW) * 71;
            const depth = x * SIN_YAW + z * COS_YAW;
            const screenY = 360 + (depth * COS_PITCH - height * SIN_PITCH) * 71;

            return `${column === 0 ? "M" : "L"}${screenX.toFixed(1)},${screenY.toFixed(1)}`;
          }).join(" ");

          return <path key={row} d={path} opacity={0.12 + Math.sin((row / 29) * Math.PI) * 0.12} />;
        })}
      </g>
    </svg>
  );
}

export function CharacterTopography() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !hero || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, strength: 0, targetStrength: 0 };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points: SurfacePoint[] = [];
    let atlas: HTMLCanvasElement | null = null;
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let inView = true;
    let disposed = false;
    let scrollProgress = 0;

    const draw = (now: number) => {
      frame = 0;
      if (disposed || !inView || document.hidden || !atlas) return;

      if (previousTime && now - previousTime < FRAME_INTERVAL - 1 && !motionQuery.matches) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.08) : 0;
      previousTime = now;
      const animated = !motionQuery.matches;
      if (animated) elapsed += delta;

      const ease = 1 - Math.exp(-delta * 5);
      pointer.x += (pointer.targetX - pointer.x) * ease;
      pointer.y += (pointer.targetY - pointer.y) * ease;
      pointer.strength += (pointer.targetStrength - pointer.strength) * ease;

      const mobile = width < 768;
      const scale = mobile ? width * 0.115 : Math.min(width * 0.105, height * 0.195);
      const centerX = width * (mobile ? 0.64 : 0.75);
      const centerY = height * (mobile ? 0.32 : 0.53) - scrollProgress * 28;
      const a = elapsed * 0.16;
      const b = -elapsed * 0.12;
      const c = elapsed * 0.09;
      const sinA = Math.sin(a), cosA = Math.cos(a);
      const sinB = Math.sin(b), cosB = Math.cos(b);
      const sinC = Math.sin(c), cosC = Math.cos(c);
      const tile = TILE_SIZE * pixelRatio;
      const radius = Math.min(width * 0.16, 200);

      context.fillStyle = "#090908";
      context.fillRect(0, 0, width, height);

      for (const point of points) {
        if (point.fade < 0.015) continue;

        const waveA = point.sinA * cosA + point.cosA * sinA;
        const waveB = point.sinB * cosB + point.cosB * sinB;
        const waveC = point.cosC * cosC - point.sinC * sinC;
        const heightValue = waveA * 0.85 + waveB * 0.45 + waveC * 0.15 + point.lift;
        const rotatedX = point.x * COS_YAW - point.z * SIN_YAW;
        const depth = point.x * SIN_YAW + point.z * COS_YAW;
        const perspective = 11 / (11 + depth * 0.4);
        const screenX = centerX + rotatedX * scale * perspective;
        let screenY = centerY + (depth * COS_PITCH - heightValue * SIN_PITCH) * scale * perspective;

        if (animated && pointer.strength > 0.002) {
          const distance = ((screenX - pointer.x) ** 2 + (screenY - pointer.y) ** 2) / (radius * radius);
          screenY -= Math.exp(-distance * 2) * pointer.strength * 34;
        }

        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) continue;

        const slopeX = (point.cosA * cosA - point.sinA * sinA) * 0.67
          - (point.cosB * cosB - point.sinB * sinB) * 0.126
          - (point.sinC * cosC + point.cosC * sinC) * 0.222;
        const slopeZ = (point.cosA * cosA - point.sinA * sinA) * 0.391
          + (point.cosB * cosB - point.sinB * sinB) * 0.504
          - (point.sinC * cosC + point.cosC * sinC) * 0.108;
        const light = Math.max(0, (0.73 - slopeX * 0.4 - slopeZ * 0.55) / Math.sqrt(1 + slopeX * slopeX + slopeZ * slopeZ));
        const contour = Math.exp(-((Math.sin(heightValue * 5.2) * 4) ** 2));
        const quietSpace = mobile ? 1 : 0.12 + smoothstep(0.28, 0.63, screenX / width) * 0.88;
        const verticalFade = mobile
          ? smoothstep(0.1, 0.2, screenY / height) * (1 - smoothstep(0.49, 0.65, screenY / height))
          : smoothstep(0.06, 0.22, screenY / height) * (1 - smoothstep(0.85, 1, screenY / height));
        const opacity = (0.11 + light * 0.45 + contour * 0.28) * point.fade * quietSpace * verticalFade * (1 - scrollProgress * 0.28);
        const tone = Math.min(TONES - 1, Math.floor(opacity * TONES));
        if (opacity < 0.025) continue;

        const size = (mobile ? 12.5 : 15) * perspective;
        context.drawImage(
          atlas,
          tone * tile, point.glyph * tile, tile, tile,
          screenX - size / 2, screenY - size / 2, size, size,
        );
      }

      canvas.dataset.ready = "true";
      if (animated) frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!frame && !disposed && inView && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const font = getComputedStyle(hero).getPropertyValue("--font-geist-mono").trim() || "monospace";
      atlas = createGlyphAtlas(pixelRatio, `${font}, monospace`);
      points = createSurface(width < 768 ? 100 : 160, width < 768 ? 68 : 104);
      previousTime = 0;
      schedule();
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motionQuery.matches) return;
      const bounds = hero.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left;
      pointer.targetY = event.clientY - bounds.top;
      if (!pointer.targetStrength) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.targetStrength = 1;
    };
    const leavePointer = () => { pointer.targetStrength = 0; };
    const updateScroll = () => {
      if (motionQuery.matches || !height) return;
      scrollProgress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / height));
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (motionQuery.matches) {
        pointer.strength = 0;
        pointer.targetStrength = 0;
        scrollProgress = 0;
      }
      schedule();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    intersectionObserver.observe(hero);
    hero.addEventListener("pointermove", movePointer, { passive: true });
    hero.addEventListener("pointerleave", leavePointer);
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("visibilitychange", updatePlayback);
    motionQuery.addEventListener("change", updatePlayback);
    // Rebuild the small glyph atlas once the self-hosted font is available.
    void document.fonts.ready.then(() => { if (!disposed) resize(); });
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener("pointermove", movePointer);
      hero.removeEventListener("pointerleave", leavePointer);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("visibilitychange", updatePlayback);
      motionQuery.removeEventListener("change", updatePlayback);
    };
  }, []);

  return (
    <div aria-hidden="true" className="topography-art pointer-events-none absolute inset-0" data-testid="hero-topography">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" data-ready="false" />
      <SurfacePoster />
    </div>
  );
}
