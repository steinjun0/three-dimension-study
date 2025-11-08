export const KeyboardControlInputs = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
} as const;

export type KeyboardControlInputs =
  (typeof KeyboardControlInputs)[keyof typeof KeyboardControlInputs];

export const keyboardMap = [
  { name: KeyboardControlInputs.up, keys: ["ArrowUp", "KeyW"] },
  { name: KeyboardControlInputs.down, keys: ["ArrowDown", "KeyS"] },
  { name: KeyboardControlInputs.left, keys: ["ArrowLeft", "KeyA"] },
  { name: KeyboardControlInputs.right, keys: ["ArrowRight", "KeyD"] },
];
