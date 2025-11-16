import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";

import { useRef } from "react";
import type { BasicMoveKeyboardControlInputs } from "../../../utils/keyboard/basic-move-keyboard-control-inputs";
import { parseBidirectionalInput } from "../../../utils/keyboard/parse-birdrecional-input";

import * as THREE from "three";

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

  const tempQuaternion = new THREE.Quaternion();
  const tempVector = new THREE.Vector3();
  const enemyTargetVector = new THREE.Vector3();

  // 격자 배치 상수
  const GRID_SIZE = 10;
  const SPACING = 5;
  const START_POS = (GRID_SIZE * SPACING) / 2 - SPACING / 2;

  useFrame(() => {
    const { up, down, left, right } = get();

    const agentBody = agent.current;

    if (agentBody) {
      const currentAgentTranslation = new THREE.Vector3(
        agentBody.translation().x,
        0,
        agentBody.translation().z
      );
      camera.position.set(
        agentBody.translation().x,
        100,
        agentBody.translation().z
      );
      camera.lookAt(agentBody.translation().x, 0, agentBody.translation().z);

      //
      enemyRefs.current.forEach((enemyBody) => {
        if (enemyBody) {
          const currentEnemyTranslation = new THREE.Vector3(
            enemyBody.translation().x,
            0,
            enemyBody.translation().z
          );

          // target까지 달려드는 vector
          const agentDiff = new THREE.Vector3(
            currentAgentTranslation.x - currentEnemyTranslation.x,
            0,
            currentAgentTranslation.z - currentEnemyTranslation.z
          ).multiplyScalar(1); // 임펄스 값은 조금 낮춤

          // enemy들끼리 멀어지는 vector
          const seperationDiff = new THREE.Vector3(0, 0, 0);
          enemyRefs.current.forEach((_enemyBody) => {
            if (_enemyBody == enemyBody || _enemyBody == null) {
              return;
            }
            const otherEnemyBodyTranlation = _enemyBody.translation();

            const otherEnemyDistance = new THREE.Vector3(
              otherEnemyBodyTranlation.x,
              0,
              otherEnemyBodyTranlation.z
            ).distanceTo(currentEnemyTranslation);

            seperationDiff
              .add(
                new THREE.Vector3(
                  currentEnemyTranslation.x - otherEnemyBodyTranlation.x,
                  0,
                  currentEnemyTranslation.z - otherEnemyBodyTranlation.z
                )
              )
              .multiplyScalar(Math.max(10 / otherEnemyDistance, 0.7));
          });

          const totalDiff = agentDiff.add(
            seperationDiff.divideScalar(enemyRefs.current.length - 1)
          );

          enemyBody.applyImpulse(agentDiff, true);

          // 내적을 이용해 각도를 계산하기 때문에, normalize해줘야함.
          // (normalize안하면 각도가 작은건지, 길이가 긴건지 알 수 없음)
          enemyTargetVector.set(agentDiff.x, 0, agentDiff.z).normalize();

          tempVector.set(0, 0, 1); // 최초 enemy들이 정의되어 있는 방향
          tempQuaternion.setFromUnitVectors(tempVector, enemyTargetVector);

          // 4. RigidBody에 쿼터니언 적용 (적 회전)
          enemyBody.setRotation(tempQuaternion, true);
        }
      });

      const isAboveGround = currentAgentTranslation.y > -1;
      const AGENT_FORCE = 5;
      if (isAboveGround && (up || down || left || right)) {
        agentBody.applyImpulse(
          {
            x:
              // currentAgentTranslation.x +
              parseBidirectionalInput({ negative: left, positive: right }) *
              AGENT_FORCE,
            y: 0,
            z:
              // currentAgentTranslation.z +
              parseBidirectionalInput({ negative: up, positive: down }) *
              AGENT_FORCE,
          },
          true
        );
      }
    }
  });

  return (
    <mesh>
      {/* <OrbitControls /> */}
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
        <RigidBody type="fixed" position={[0, -1, 0]}>
          <mesh>
            <meshStandardMaterial color="grey" />
            <boxGeometry args={[100, 1, 100]} />
          </mesh>
        </RigidBody>

        {/* agent */}
        <RigidBody position={[0, 5, 0]} ref={agent} linearDamping={1}>
          <mesh>
            <meshStandardMaterial color={"orange"} />
            <sphereGeometry args={[1, 32, 16]} />
          </mesh>
        </RigidBody>

        {/* enemies */}
        <group>
          {new Array(ENEMIES_COUNT).fill(null).map((_, index) => {
            const xIndex = index % GRID_SIZE;
            const zIndex = Math.floor(index / GRID_SIZE);

            return (
              <RigidBody
                position={[
                  // ⭐ 격자 형태로 넓게 분산 배치
                  xIndex * SPACING - START_POS,
                  0, // 바닥 바로 위
                  zIndex * SPACING - START_POS,
                ]}
                key={index}
                ref={(el) => setEnemyRef(el, index)}
                /** 속도가 너무 빨라지지 않도록 선형 감속 추가(물체 속도에 반비례 하여 늦추는 힘 추가) */
                linearDamping={0.5}
              >
                <mesh
                /**
                 * @note
                 * 지금 rigidBody의 position을 잡기 때문에
                 * 여기에 position을 설정하면
                 * rigidBody의 tranlsation은 [0, 0, 0]이고,
                 * mesh의 위치만 바뀐것으로 해석된다
                 */
                >
                  {/* <boxGeometry args={[2, 1, 5]} /> */}
                  <sphereGeometry args={[2, 4, 1]} />
                  <meshStandardMaterial color={"white"} />
                </mesh>
              </RigidBody>
            );
          })}
        </group>
      </Physics>
    </mesh>
  );
};
