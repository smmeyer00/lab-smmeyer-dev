"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Info, LocateFixed, MousePointer2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DeskScene = dynamic(
  () => import("./desk-scene").then((module) => module.DeskScene),
  { ssr: false },
);

type CameraMode = "inspect" | "walk";

export function DeskExperience() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<CameraMode>("inspect");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (mode !== "walk") return;

    const exitWalk = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMode("inspect");
    };

    window.addEventListener("keydown", exitWalk);
    return () => window.removeEventListener("keydown", exitWalk);
  }, [mode]);

  const chromeHidden = mode === "walk";
  const markReady = useCallback(() => setReady(true), []);

  return (
    <main
      className="relative isolate h-svh min-h-[34rem] overflow-hidden bg-[#080807] text-[#ece9e1] selection:bg-[#ece9e1] selection:text-[#090908]"
      data-testid="desk-viewer"
      data-ready={ready}
      data-mode={mode}
    >
      <div className="absolute inset-0">
        <DeskScene
          mode={mode}
          resetToken={resetToken}
          onModeChange={setMode}
          onReady={markReady}
        />
      </div>

      <div className="desk-screen-vignette pointer-events-none absolute inset-0 z-10" />
      <div className="desk-noise pointer-events-none absolute inset-0 z-10 opacity-[0.035]" />

      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 border-b border-white/10 transition-opacity duration-500 ${
          chromeHidden ? "opacity-25" : "opacity-100"
        }`}
      >
        <div className="flex h-18 items-center justify-between px-4 sm:h-20 sm:px-7 lg:px-9">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Smmeyer <span className="text-white/30">/</span> Lab
          </Link>

          <div
            className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/42"
            aria-live="polite"
          >
            <span
              className={`size-1.5 rounded-full ${
                ready ? "signal-dot bg-[#e7e3d8]" : "bg-white/25"
              }`}
            />
            {ready ? "Scene ready" : "Loading scene"}
          </div>
        </div>
      </header>

      <section
        className={`pointer-events-none absolute left-4 top-25 z-20 transition-all duration-500 sm:left-7 sm:top-30 lg:left-9 ${
          chromeHidden ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-labelledby="desk-title"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/42">
          Experiment / 001
        </p>
        <h1
          id="desk-title"
          className="mt-2 text-[clamp(3.8rem,8vw,8.5rem)] font-semibold leading-[0.78] tracking-[-0.075em] text-[#ece9e1]"
        >
          DESK<span className="text-white/25">.</span>
        </h1>
        <p className="mt-5 max-w-[20rem] text-sm leading-6 text-white/48 sm:max-w-sm sm:text-base">
          I gave GPT-6 Astra some photos and access to Blender. This is what it
          built.
        </p>
      </section>

      <div
        className={`pointer-events-none absolute inset-0 z-40 grid place-items-center transition-opacity duration-300 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={ready}
      >
        <div className="w-42 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
          <div className="mb-3 flex items-center justify-between">
            <span>Loading model</span>
            <span>Please wait</span>
          </div>
          <div className="h-px overflow-hidden bg-white/14">
            <div className="desk-loader-bar h-px w-1/3 bg-[#e7e3d8]" />
          </div>
        </div>
      </div>

      {mode === "walk" && (
        <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-white/60" />
          <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-white/60" />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 sm:bottom-8">
            WASD move&nbsp;&nbsp;·&nbsp;&nbsp;Shift run&nbsp;&nbsp;·&nbsp;&nbsp;Space
            jump&nbsp;&nbsp;·&nbsp;&nbsp;R reset&nbsp;&nbsp;·&nbsp;&nbsp;Esc exit
          </p>
        </div>
      )}

      <div
        className={`absolute bottom-4 left-4 z-30 flex items-center gap-2 transition-all duration-500 sm:bottom-7 sm:left-7 lg:left-9 ${
          chromeHidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
        }`}
      >
        {!coarsePointer && (
          <button
            id="desk-enter-scene"
            type="button"
            disabled={!ready}
            onClick={() => setMode("walk")}
            className="glass-panel group inline-flex h-11 items-center gap-3 px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:text-white/25 sm:px-5"
          >
            <MousePointer2 aria-hidden="true" className="size-3.5" />
            Enter scene
          </button>
        )}

        <button
          type="button"
          disabled={!ready}
          onClick={() => setResetToken((token) => token + 1)}
          className="glass-panel inline-flex size-11 items-center justify-center text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-wait disabled:text-white/20"
          aria-label="Reset camera"
          title="Reset camera"
        >
          <LocateFixed aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <div
        className={`pointer-events-none absolute bottom-5 right-4 z-20 text-right font-mono text-[8px] uppercase leading-5 tracking-[0.16em] text-white/35 transition-opacity duration-500 sm:bottom-8 sm:right-7 sm:text-[9px] lg:right-9 ${
          chromeHidden ? "opacity-0" : "opacity-100"
        }`}
      >
        <p>{coarsePointer ? "Drag orbit / pinch zoom" : "Drag orbit / scroll zoom"}</p>
        <p>Blender / React Three Fiber</p>
      </div>

      <button
        type="button"
        onClick={() => setAboutOpen(true)}
        className={`glass-panel absolute right-4 top-25 z-30 inline-flex size-10 items-center justify-center text-white/55 transition-all duration-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-7 sm:top-27 lg:right-9 ${
          chromeHidden ? "pointer-events-none -translate-y-2 opacity-0" : "opacity-100"
        }`}
        aria-label="About this experiment"
      >
        <Info aria-hidden="true" className="size-3.5" />
      </button>

      <aside
        className={`glass-panel absolute bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col px-6 py-7 transition-transform duration-500 ease-out sm:px-8 sm:py-8 ${
          aboutOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!aboutOpen}
        aria-label="About the desk experiment"
        inert={!aboutOpen}
      >
        <div className="flex items-center justify-between border-b border-white/12 pb-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/42">
            About / 001
          </p>
          <button
            type="button"
            onClick={() => setAboutOpen(false)}
            className="inline-flex size-9 items-center justify-center text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Close about panel"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="my-auto">
          <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#e8e5dd] sm:text-5xl">
            Rebuilt from a handful of photos.
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-6 text-white/52 sm:text-base sm:leading-7">
            <p>
              I wanted to see how far GPT-6 Astra could get in Blender with MCP
              access and reference photos of my actual desk.
            </p>
            <p>
              The agent handled the modeling. I did some art direction and then
              brought the result here so you can walk around it. Some details are
              precise. Others are educated guesses. That seems fair given the input.
            </p>
          </div>
        </div>

        <dl className="border-t border-white/12 font-mono text-[9px] uppercase tracking-[0.16em]">
          <div className="flex justify-between border-b border-white/12 py-4">
            <dt className="text-white/32">Model</dt>
            <dd className="text-white/62">Blender / GLB</dd>
          </div>
          <div className="flex justify-between border-b border-white/12 py-4">
            <dt className="text-white/32">Built with</dt>
            <dd className="text-white/62">GPT-6 Astra / MCP</dd>
          </div>
          <div className="flex justify-between py-4">
            <dt className="text-white/32">Viewer</dt>
            <dd className="text-white/62">R3F / Three.js</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
