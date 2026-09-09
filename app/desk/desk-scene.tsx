"use client";

import {
  OrbitControls,
  PointerLockControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  MathUtils,
  SRGBColorSpace,
  Vector3,
} from "three";

const MODEL_URL = "/models/desk-setup.glb";
const INSPECT_POSITION: [number, number, number] = [7.25, 5.15, 7.8];
const MOBILE_INSPECT_POSITION: [number, number, number] = [10.6, 7.2, 11.4];
const WALK_POSITION: [number, number, number] = [0, 1.65, 6.25];
const TARGET: [number, number, number] = [0, 1.45, 0];

type CameraMode = "inspect" | "walk";

type DeskSceneProps = {
  mode: CameraMode;
  resetToken: number;
  onModeChange: (mode: CameraMode) => void;
  onReady: () => void;
  onWalkRequestReady: (request: () => void) => void;
};

function DeskModel({ onReady }: Pick<DeskSceneProps, "onReady">) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const model = useMemo(() => scene.clone(true), [scene]);
  const position = useMemo<[number, number, number]>(() => {
    model.updateWorldMatrix(true, true);
    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());

    return [-center.x, -bounds.min.y, -center.z];
  }, [model]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return <primitive object={model} position={position} />;
}

function CameraRig({
  mode,
  resetToken,
  onModeChange,
  onWalkRequestReady,
}: Pick<
  DeskSceneProps,
  "mode" | "resetToken" | "onModeChange" | "onWalkRequestReady"
>) {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);
  const pointerLock = useRef<ComponentRef<typeof PointerLockControls>>(null);
  const [autoRotate, setAutoRotate] = useState(
    () =>
      typeof window === "undefined" ||
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const inspectPosition = aspect < 0.75 ? MOBILE_INSPECT_POSITION : INSPECT_POSITION;
    const nextPosition = mode === "walk" ? WALK_POSITION : inspectPosition;
    camera.position.set(...nextPosition);
    camera.lookAt(...TARGET);
    camera.updateProjectionMatrix();

  }, [aspect, camera, mode, resetToken]);

  useEffect(() => {
    onWalkRequestReady(() => {
      pointerLock.current?.lock();
    });

    return () => onWalkRequestReady(() => undefined);
  }, [onWalkRequestReady]);

  return (
    <>
      <OrbitControls
        enabled={mode === "inspect"}
        target={TARGET}
        enableDamping
        dampingFactor={0.055}
        autoRotate={autoRotate && mode === "inspect"}
        autoRotateSpeed={0.35}
        minDistance={3.9}
        maxDistance={14}
        minPolarAngle={0.18}
        maxPolarAngle={Math.PI / 2.03}
        onStart={() => setAutoRotate(false)}
      />
      <PointerLockControls
        ref={pointerLock}
        onLock={() => {
          setAutoRotate(false);
          onModeChange("walk");
        }}
        onUnlock={() => onModeChange("inspect")}
      />
      <WalkMovement active={mode === "walk"} resetToken={resetToken} />
    </>
  );
}

function WalkMovement({
  active,
  resetToken,
}: {
  active: boolean;
  resetToken: number;
}) {
  const camera = useThree((state) => state.camera);
  const keys = useRef(new Set<string>());
  const vectors = useRef({
    forward: new Vector3(),
    right: new Vector3(),
    movement: new Vector3(),
  });

  useEffect(() => {
    if (!active) {
      keys.current.clear();
      return;
    }

    const pressedKeys = keys.current;
    const reset = () => {
      camera.position.set(...WALK_POSITION);
      camera.lookAt(...TARGET);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (["w", "a", "s", "d", "shift", "r"].includes(key)) {
        event.preventDefault();
      }
      if (key === "r") reset();
      pressedKeys.add(key);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
    };
    const clearKeys = () => pressedKeys.clear();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      pressedKeys.clear();
    };
  }, [active, camera]);

  useEffect(() => {
    if (active) {
      camera.position.set(...WALK_POSITION);
      camera.lookAt(...TARGET);
    }
  }, [active, camera, resetToken]);

  /* eslint-disable react-hooks/immutability -- Three.js camera movement is intentionally imperative. */
  useFrame((_, delta) => {
    if (!active) return;

    const { forward, right, movement } = vectors.current;
    camera.getWorldDirection(forward);
    forward.setY(0);
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    movement.set(0, 0, 0);

    if (keys.current.has("w")) movement.add(forward);
    if (keys.current.has("s")) movement.sub(forward);
    if (keys.current.has("d")) movement.add(right);
    if (keys.current.has("a")) movement.sub(right);

    if (movement.lengthSq() > 0) {
      const speed = keys.current.has("shift") ? 4 : 2;
      camera.position.addScaledVector(movement.normalize(), speed * Math.min(delta, 0.1));
    }

    camera.position.x = MathUtils.clamp(camera.position.x, -7.5, 7.5);
    camera.position.y = WALK_POSITION[1];
    camera.position.z = MathUtils.clamp(camera.position.z, -7.5, 8.5);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

function SceneContents(props: DeskSceneProps) {
  return (
    <>
      <color attach="background" args={["#080807"]} />
      <fog attach="fog" args={["#080807", 12, 24]} />

      <ambientLight intensity={1.4} />
      <hemisphereLight color="#f0ece1" groundColor="#171713" intensity={1.8} />
      <directionalLight color="#f1ede3" intensity={2.5} position={[5, 8, 6]} />
      <spotLight
        color="#d9d1bf"
        intensity={35}
        position={[-5, 7, 4]}
        angle={0.5}
        penumbra={1}
        distance={18}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial color="#0b0b09" roughness={0.94} metalness={0.04} />
      </mesh>
      <gridHelper args={[32, 64, "#302f2a", "#171715"]} position={[0, -0.015, 0]} />

      <Suspense fallback={null}>
        <DeskModel onReady={props.onReady} />
      </Suspense>
      <CameraRig
        mode={props.mode}
        resetToken={props.resetToken}
        onModeChange={props.onModeChange}
        onWalkRequestReady={props.onWalkRequestReady}
      />
    </>
  );
}

export function DeskScene(props: DeskSceneProps) {
  return (
    <Canvas
      camera={{ position: INSPECT_POSITION, fov: 38, near: 0.05, far: 100 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        outputColorSpace: SRGBColorSpace,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      fallback={
        <div className="grid h-full place-items-center bg-[#080807] px-6 text-center text-sm text-white/55">
          This browser could not start the 3D viewer.
        </div>
      }
    >
      <SceneContents {...props} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL, false, true);
