import type { SpeciesId } from "../catalog.ts";
export type Branch =
  { label: string; children: Branch[] } | { suite: SpeciesId };
const leaf = (suite: SpeciesId): Branch => ({ suite });
const group = (label: string, ...children: Branch[]): Branch => ({
  label,
  children,
});
/** Selected clades, not branch lengths or an exhaustive evolutionary hypothesis. */
export const taxonomy = group(
  "Life",
  leaf("bacteria"),
  group(
    "Eukaryotes",
    group("Flowering plants", leaf("vines"), leaf("leaves")),
    group("Amoebozoa", leaf("physarum")),
    group(
      "Animals",
      leaf("coral"),
      group(
        "Bilaterians",
        group(
          "Protostomes",
          leaf("worms"),
          group("Insects", leaf("ants"), leaf("termites"), leaf("fireflies")),
        ),
        group(
          "Vertebrates",
          leaf("starlings"),
          group("Mammals", leaf("sheep"), leaf("orcas")),
        ),
      ),
    ),
  ),
);
export const experiments: Record<SpeciesId, string[]> = {
  starlings: ["metric", "topological"],
  sheep: ["collect-drive", "drive", "objective"],
  orcas: ["encircle", "pursue"],
  ants: ["routes", "foraging"],
  termites: ["field", "particles", "mound", "fixed-mound"],
  coral: ["aggregate", "surface", "volume"],
  vines: ["contact", "free", "supported-planar", "supported-spatial"],
  leaves: [
    "ripple-sketch",
    "curl-sketch",
    "elastic",
    "free-sheet",
    "midrib-sheet",
  ],
  bacteria: ["boundary-food", "rich-medium"],
  worms: ["intact", "cut", "bend-relay", "bend-cut"],
  fireflies: ["global", "local"],
  physarum: ["adaptive", "fixed"],
};
export const MODEL_REVISION = "atlas-3";
