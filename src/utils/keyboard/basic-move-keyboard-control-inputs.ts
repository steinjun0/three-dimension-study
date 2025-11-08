export const BasicMoveKeyboardControlInputs = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
} as const;

export type BasicMoveKeyboardControlInputs =
  (typeof BasicMoveKeyboardControlInputs)[keyof typeof BasicMoveKeyboardControlInputs];

export const basicMoveKeyboardControlInputMap = [
  { name: BasicMoveKeyboardControlInputs.up, keys: ["ArrowUp", "KeyW"] },
  { name: BasicMoveKeyboardControlInputs.down, keys: ["ArrowDown", "KeyS"] },
  { name: BasicMoveKeyboardControlInputs.left, keys: ["ArrowLeft", "KeyA"] },
  { name: BasicMoveKeyboardControlInputs.right, keys: ["ArrowRight", "KeyD"] },
];
