export function parseBidirectionalInput({
  negative,
  positive,
}: {
  negative: boolean;
  positive: boolean;
}) {
  if (!negative && !positive) {
    return 0;
  }
  if (!negative && positive) {
    return 1;
  }
  if (negative && !positive) {
    return -1;
  }
  if (negative && positive) {
    return 0;
  }
  return 0;
}
