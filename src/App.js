import React, { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree
} from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "drei";
import "./styles.css";
import coinURL from "../assets/spotify.glb";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";

extend({ EffectComposer, ShaderPass, RenderPass, AfterimagePass, BokehPass });

function Coins({ count }) {
  const { clock } = useThree();
  const model = useRef();
  const gltf = useLoader(GLTFLoader, coinURL);
  console.log(gltf.scenes[0].children);
  const coinGeo = gltf.scenes[0].children[9];
  const waveGeo = gltf.scenes[0].children[4];

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const coins = useMemo(() => {
    const temp = [];

    for (let i = 0; i < count; i++) {
      temp.push({
        // position: [
        //   2.5 - Math.random() * 5,
        //   4 + Math.random() * 20,
        //   2.5 - Math.random() * 15
        // ],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        speed: Math.random(),
        scale: 1
      });
    }

    return temp;
  }, [count]);

  useFrame(() => {
    const t = clock.getElapsedTime();

    coins.forEach((coin, i) => {
      // coin.position[1] -= 0.05;

      // if (coin.position[1] < -20) {
      //   coin.position[1] = 8;
      // }

      let { position, rotation, scale } = coin;

      dummy.position.set(position[0], position[1], position[2]);
      dummy.rotation.set(0, 0, 0);

      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      model.current.setMatrixAt(i, dummy.matrix);
    });
    model.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={model} args={[null, null, count]}>
        <bufferGeometry
          dispose={false}
          attach="geometry"
          {...coinGeo.geometry}
        />
        <meshStandardMaterial attach="material" {...coinGeo.material} />
      </instancedMesh>
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={10} />
      <directionalLight intensity={2} position={[-10, 0, 3]} />
      <directionalLight intensity={2} position={[10, 0, 3]} />
    </>
  );
}

export default function App() {
  return (
    <Canvas camera={{ fov: 60, position: [0, 0, 6] }}>
      <Lights />
      <Suspense fallback={null}>
        <Coins count={10} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

function randomInRange(to, from) {
  let x = Math.random() * (to - from);
  return x + from;
}
