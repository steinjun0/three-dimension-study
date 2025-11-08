import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";

import { useRef } from "react";
import type { BasicMoveKeyboardControlInputs } from "../../../utils/keyboard/basic-move-keyboard-control-inputs";
import { parseBidirectionalInput } from "../../../utils/keyboard/parse-birdrecional-input";

const ENEMIES_COUNT = 100;

export const AgentPageCanvas = () => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls<BasicMoveKeyboardControlInputs>();

  camera.lookAt(0, 0, 0);
  camera.position.set(0, 100, 0);

  const agent = useRef<RapierRigidBody>(null);
  const enemyRefs = useRef<(RapierRigidBody | null)[]>([]);

  const setEnemyRef = (el: RapierRigidBody | null, index: number) => {
    if (el) {
      enemyRefs.current[index] = el;
    }
  };

  useFrame(() => {
    const { up, down, left, right } = get();

    const agentBody = agent.current;

    if (agentBody) {
      const currentAgentTranslation = agentBody.translation();

      //
      enemyRefs.current.forEach((enemyBody, index) => {
        if (enemyBody) {
          // 1. 현재 위치 가져오기
          const currentEnemyTranslation = enemyBody.translation();
          const diff = {
            x: (currentAgentTranslation.x - currentEnemyTranslation.x) * 0.1,
            y: 0,
            z: (currentAgentTranslation.z - currentEnemyTranslation.z) * 0.1,
          };
          enemyBody.applyImpulse(diff, true);
        }
      });

      const isAboveGround = currentAgentTranslation.y > -1;
      if (isAboveGround && (up || down || left || right)) {
        agentBody.setTranslation(
          {
            x:
              currentAgentTranslation.x +
              parseBidirectionalInput({ negative: left, positive: right }),
            y: 0,
            z:
              currentAgentTranslation.z +
              parseBidirectionalInput({ negative: up, positive: down }),
          },
          true
        );
      }
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
            <boxGeometry args={[1000, 1, 1000]} />
          </mesh>
        </RigidBody>

        {/* agent */}
        <RigidBody position={[0, 30, 0]} ref={agent} type="fixed">
          <mesh>
            <meshStandardMaterial color={"orange"} />
            <sphereGeometry args={[1, 32, 16]} />
          </mesh>
        </RigidBody>

        {/* enemies */}
        <group>
          {new Array(ENEMIES_COUNT).fill(null).map((_, index) => {
            return (
              <RigidBody key={index} ref={(el) => setEnemyRef(el, index)}>
                <mesh
                  position={[
                    Math.floor(index / 10) * 10 - 50,
                    10,
                    (index % 10) * 4 - 25,
                  ]}
                >
                  <boxGeometry args={[5, 1, 2]} />
                  <meshStandardMaterial color={"white"} />
                </mesh>
              </RigidBody>
            );
          })}
        </group>
      </Physics>

      <OrbitControls enabled={false} />
    </mesh>
  );
};
