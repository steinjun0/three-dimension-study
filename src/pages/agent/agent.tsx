import { Canvas } from "@react-three/fiber";
import { AgentPageCanvas } from "./_components/agent-page-canvas";
import { KeyboardControls } from "@react-three/drei";
import { keyboardMap } from "./_contants/keyboard-control";

export const AgentPage = () => {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas>
        <AgentPageCanvas />
      </Canvas>
    </KeyboardControls>
  );
};
