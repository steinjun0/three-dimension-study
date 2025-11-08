import { Canvas } from "@react-three/fiber";
import { AgentPageCanvas } from "./_components/agent-page-canvas";
import { KeyboardControls } from "@react-three/drei";
import { basicMoveKeyboardControlInputMap } from "../../utils/keyboard/basic-move-keyboard-control-inputs";

export const AgentPage = () => {
  return (
    <KeyboardControls map={basicMoveKeyboardControlInputMap}>
      <Canvas>
        <AgentPageCanvas />
      </Canvas>
    </KeyboardControls>
  );
};
