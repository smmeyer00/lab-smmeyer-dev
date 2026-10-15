"use client";

import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  Mesh,
  SRGBColorSpace,
  Vector3,
} from "three";

const TARGET: [number, number, number] = [0, 0.25, 0];

type BooksSceneProps = {
  modelPath: string;
  isCollection: boolean;
  resetToken: number;
  onReady: () => void;
};

function BookModel({
  modelPath,
  isCollection,
  onReady,
}: Pick<BooksSceneProps, "modelPath" | "isCollection" | "onReady">) {
  const { scene } = useGLTF(modelPath, false, true);
  const { model, position, scale } = useMemo(() => {
    const nextModel = scene.clone(true);
    nextModel.updateWorldMatrix(true, true);

    const bounds = new Box3().setFromObject(nextModel);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const targetSpan = isCollection ? 7.2 : 3.4;
    const nextScale = targetSpan / Math.max(size.x, size.y, size.z);

    nextModel.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    return {
      model: nextModel,
      scale: nextScale,
      position: [
        -center.x * nextScale,
        -bounds.min.y * nextScale + 0.025,
        -center.z * nextScale,
      ] as [number, number, number],
    };
  }, [isCollection, scene]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return <primitive object={model} position={position} scale={scale} />;
}

function CameraRig({
  isCollection,
  resetToken,
}: Pick<BooksSceneProps, "isCollection" | "resetToken">) {
  const camera = useThree((state) => state.camera);
  const aspect = useThree((state) => state.size.width / state.size.height);

  useEffect(() => {
    const mobile = aspect < 0.95;
    const position: [number, number, number] = isCollection
      ? mobile
        ? [7.8, 8.6, 10.2]
        : [6.8, 6.2, 8.3]
      : mobile
        ? [5.2, 5.5, 6.4]
        : [4.4, 3.7, 5.2];

    camera.position.set(...position);
    camera.lookAt(...TARGET);
    camera.updateProjectionMatrix();
  }, [aspect, camera, isCollection, resetToken]);

  return (
    <OrbitControls
      target={TARGET}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.35}
      maxDistance={18}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2.02}
    />
  );
}

function SceneContents(props: BooksSceneProps) {
  return (
    <>
      <color attach="background" args={["#090908"]} />
      <fog attach="fog" args={["#090908", 11, 24]} />

      <ambientLight intensity={1.15} />
      <hemisphereLight color="#f1eee6" groundColor="#11110f" intensity={1.8} />
      <directionalLight
        castShadow
        color="#f5f0e5"
        intensity={3.1}
        position={[5, 8, 5]}
      />
      <spotLight
        color="#c9bba4"
        intensity={28}
        position={[-5, 6, 2]}
        angle={0.48}
        penumbra={1}
        distance={18}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#0b0b0a" roughness={0.93} metalness={0.02} />
      </mesh>
      <gridHelper args={[24, 48, "#292824", "#151513"]} position={[0, 0.006, 0]} />

      <Suspense fallback={null}>
        <BookModel
          key={props.modelPath}
          modelPath={props.modelPath}
          isCollection={props.isCollection}
          onReady={props.onReady}
        />
      </Suspense>
      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.52}
        scale={12}
        blur={2.4}
        far={7}
      />
      <CameraRig isCollection={props.isCollection} resetToken={props.resetToken} />
    </>
  );
}

export function BooksScene(props: BooksSceneProps) {
  return (
    <Canvas
      camera={{ position: [6.8, 6.2, 8.3], fov: 38, near: 0.03, far: 100 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        outputColorSpace: SRGBColorSpace,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      fallback={
        <div className="grid h-full place-items-center bg-[#090908] px-6 text-center text-sm text-white/55">
          This browser cannot open the 3D viewer.
        </div>
      }
    >
      <SceneContents {...props} />
    </Canvas>
  );
}
