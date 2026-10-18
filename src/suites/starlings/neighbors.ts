/** Bounded nearest-neighbor selection with stable input-order tie breaking. */
export function nearest<T extends { x: number; y: number }>(
  all: T[],
  focal: T,
  count = 7,
): T[] {
  const result: { point: T; d: number }[] = [];
  for (const point of all) {
    if (point === focal) continue;
    const d = (point.x - focal.x) ** 2 + (point.y - focal.y) ** 2;
    if (result.length === count && d >= result[count - 1].d) continue;
    let i = result.length;
    while (i > 0 && result[i - 1].d > d) i--;
    result.splice(i, 0, { point, d });
    if (result.length > count) result.pop();
  }
  return result.map((r) => r.point);
}
