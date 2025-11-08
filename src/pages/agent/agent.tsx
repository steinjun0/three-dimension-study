import { Canvas } from "@react-three/fiber";
import { AgentPageCanvas } from "./_components/agent-page-canvas";
import { KeyboardControls } from "@react-three/drei";

// 액션 이름을 enum으로 정의하는 것이 좋습니다.
export const Controls = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
} as const;

// 맵 정의
const keyboardMap = [
  { name: Controls.up, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.down, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
];

export const AgentPage = () => {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas>
        <AgentPageCanvas />
      </Canvas>
    </KeyboardControls>
  );
};
