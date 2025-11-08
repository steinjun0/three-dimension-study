import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";

import { useRef } from "react";
import { parseBidirectionalInput } from "../../../utils/keyboard/parse-birdrecional-input";
import type { BasicMoveKeyboardControlInputs } from "../../../utils/keyboard/basic-move-keyboard-control-inputs";

export const AgentPageCanvas = () => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls<BasicMoveKeyboardControlInputs>();

  camera.lookAt(0, 0, 0);
  camera.position.set(0, 100, 0);

  const agent = useRef<RapierRigidBody>(null);

  useFrame(() => {
    const { up, down, left, right } = get();

    const agentBody = agent.current;

    if (agentBody) {
      agentBody.setTranslation(
        {
          x:
            agentBody.translation().x +
            parseBidirectionalInput({ negative: left, positive: right }),
          y: 0,
          z:
            agentBody.translation().z +
            parseBidirectionalInput({ negative: up, positive: down }),
        },
        true
      );
    }
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
        <RigidBody position={[0, 30, 0]} ref={agent}>
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
