import { OrbitControls, Sky, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

export const AgentPageCanvas = () => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls();

  camera.lookAt(0, 0, 0);
  camera.position.set(0, 100, 0);

  useFrame(() => {
    const { up, down, left, right } = get();
    console.log(up, down, left, right);
  });

  return (
    <mesh>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Physics gravity={[0, -9.8, 0]}>
        {/* ground */}
        <RigidBody type="fixed" position={[0, 0, 0]}>
          <mesh>
            <meshStandardMaterial color="grey" />
            <boxGeometry args={[100, 1, 100]} />
          </mesh>
        </RigidBody>

        {/* agent */}
        <RigidBody position={[0, 30, 0]}>
          <mesh>
            <meshStandardMaterial color={"orange"} />
            <sphereGeometry args={[1, 32, 16]} />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls enabled={false} />
    </mesh>
  );
};
