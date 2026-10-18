export type Vec3 = { x: number; y: number; z: number };
export const axes = ["x", "y", "z"] as const;
export type Energy = {
  value: number;
  gradient: Vec3[];
  stretch: number;
  bend: number;
};

/** Projected gradient descent. Every accepted move lowers the CURRENT energy;
 * loading between calls can raise it. The residual excludes constrained DOFs. */
export function relax(
  vertices: Vec3[],
  evaluate: () => Energy,
  free: (i: number, axis: "x" | "y" | "z") => boolean,
  iterations: number,
  initialStep: number,
) {
  let state = evaluate();
  let residual = 0;
  let stepGuess = initialStep;
  for (let k = 0; k < iterations; k++) {
    let norm = 0;
    for (let i = 0; i < vertices.length; i++)
      for (const a of axes) {
        if (!free(i, a)) state.gradient[i][a] = 0;
        norm += state.gradient[i][a] ** 2;
      }
    residual = Math.sqrt(norm);
    if (residual < 1e-9) break;
    const before = vertices.map((v) => ({ ...v }));
    let accepted = false;
    for (let step = stepGuess; step > initialStep / 65536; step /= 2) {
      for (let i = 0; i < vertices.length; i++)
        for (const a of axes)
          vertices[i][a] = before[i][a] - step * state.gradient[i][a];
      const next = evaluate();
      if (
        Number.isFinite(next.value) &&
        next.value <= state.value - 1e-4 * step * norm
      ) {
        state = next;
        stepGuess = Math.min(initialStep, step * 1.5);
        accepted = true;
        break;
      }
    }
    if (!accepted) {
      vertices.forEach((v, i) => Object.assign(v, before[i]));
      break;
    }
  }
  residual = Math.sqrt(
    state.gradient.reduce(
      (s, g, i) =>
        s + axes.reduce((n, a) => n + (free(i, a) ? g[a] ** 2 : 0), 0),
      0,
    ),
  );
  return { ...state, residual };
}
