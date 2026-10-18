import { byId, defaults, type SpeciesId } from "../catalog.ts";
import { Simulation } from "../models.ts";
import { draw } from "../render.ts";

// Still specimens, all seed 42 and 600 fixed model steps. Generated once per tab.
const cache = new Map<SpeciesId, Promise<string>>();
async function specimen(id: SpeciesId) {
  const model = new Simulation(
    id,
    byId(id).defaultMode ?? 0,
    defaults(byId(id)),
    42,
  );
  for (let i = 0; i < 600;) {
    const start = performance.now();
    do {
      model.step();
      i++;
    } while (i < 600 && performance.now() - start < 6);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 224;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, model, Math.PI / 7, false);
  // Fit the complete foreground, including targets and food sites, rather than
  // magnifying just the densest cluster. Only the collection thumbnail is cropped.
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let left = canvas.width,
    right = 0,
    top = canvas.height,
    bottom = 0;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (
        Math.max(...[0, 1, 2].map((c) => Math.abs(pixels[i + c] - pixels[c]))) <
        70
      )
        continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right <= left || bottom <= top) return canvas.toDataURL();
  const size = Math.max(right - left, bottom - top) * 1.18;
  const framed = document.createElement("canvas");
  framed.width = framed.height = 220;
  const frame = framed.getContext("2d")!;
  frame.fillStyle = `rgb(${pixels[0]},${pixels[1]},${pixels[2]})`;
  frame.fillRect(0, 0, 220, 220);
  frame.drawImage(
    canvas,
    (left + right - size) / 2,
    (top + bottom - size) / 2,
    size,
    size,
    0,
    0,
    220,
    220,
  );
  return framed.toDataURL();
}
export async function showPreviews(root: HTMLElement) {
  for (const image of root.querySelectorAll<HTMLImageElement>(
    "[data-preview]",
  )) {
    if (!image.isConnected) return;
    const id = image.dataset.preview as SpeciesId;
    if (!cache.has(id)) cache.set(id, specimen(id));
    const url = await cache.get(id)!;
    if (image.isConnected) {
      image.src = url;
      image.classList.add("ready");
    }
  }
}
