// https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber
// 위 사이트 참고
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";

import { Line } from "@react-three/drei";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({
  MeshLineGeometry,
  MeshLineMaterial,
});

export const SoftBodyCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <Physics debug interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
    </Canvas>
  );
};

function Band() {
  const fixed = useRef<RapierRigidBody>(null!);
  // const band = useRef<THREE.Mesh>(null!);
  const j1 = useRef<RapierRigidBody>(null!),
    j2 = useRef<RapierRigidBody>(null!),
    j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!) // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  // const { width, height } = useThree((state) => state.size);
  const lineRef = useRef<any>(null);
  // const curvePoints = useMemo(
  //   () => [
  //     new THREE.Vector3(),
  //     new THREE.Vector3(),
  //     new THREE.Vector3(),
  //     new THREE.Vector3(),
  //   ],
  //   []
  // );

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | null>(null);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useFrame((state, delta) => {
    if (dragged != null) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    // if (fixed.current && j1.current && j2.current && j3.current) {
    //   curvePoints[0].copy(j3.current.translation());
    //   curvePoints[1].copy(j2.current.translation());
    //   curvePoints[2].copy(j1.current.translation());
    //   curvePoints[3].copy(fixed.current.translation());
    // }
    if (fixed.current) {
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());

      const numPoints = 32;
      const points = curve.getPoints(numPoints);
      lineRef.current.geometry.setPositions(
        points.flatMap((p) => [p.x, p.y, p.z])
      );

      // band.current.geometry.setFromPoints(curve.getPoints(32));
      // band.current.geometry.setPoints(curve.getPoints(32));
      // Tilt it back towards the screen
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true
      );
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody
          ref={fixed}
          angularDamping={2}
          linearDamping={2}
          type="fixed"
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          angularDamping={2}
          linearDamping={2}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          angularDamping={2}
          linearDamping={2}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <mesh
            onPointerUp={(e) => drag(null)}
            onPointerDown={(e) =>
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            }
          >
            <planeGeometry args={[0.8 * 2, 1.125 * 2]} />
            <meshBasicMaterial
              transparent
              opacity={0.25}
              color="white"
              side={THREE.DoubleSide}
            />
          </mesh>
        </RigidBody>
      </group>
      <Line
        ref={lineRef}
        points={[
          [0, 0, 0],
          [0, 0, 0],
        ]} // 초기 더미 데이터 (배열 형태 준수!)
        // color="white"
        // color with opacity
        color={"#545454"}
        lineWidth={30}
      />
      {/* <CatmullRomLine
        points={curvePoints} // Vector3[] 연결
        color="white"
        lineWidth={10}
        segments={32}
        // segmentPoints={32} // 곡선 부드러움 정도
      /> */}
      {/* <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          transparent
          opacity={0.25}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          lineWidth={1}
        />
      </mesh> */}
    </>
  );
}
