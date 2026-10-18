import { species, byId, type SpeciesId } from "../catalog.ts";
import { taxonomy, type Branch } from "../content/taxonomy.ts";

type Node = {
  label: string;
  suite?: SpeciesId;
  x: number;
  y: number;
  selected: boolean;
  children: Node[];
};

/** Rectangular cladogram. Coordinates encode topology, never evolutionary time. */
export function treeView(selected: SpeciesId, query = "") {
  const matches = new Set(
    species
      .filter((s) =>
        `${s.name} ${s.latin} ${s.family} ${s.title} ${s.algorithm}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
      )
      .map((s) => s.id),
  );
  const tips: Node[] = [];
  let ancestry: string[] = [];
  const layout = (
    branch: Branch,
    depth: number,
    parents: string[],
  ): Node | null => {
    if ("suite" in branch) {
      if (!matches.has(branch.suite)) return null;
      const node: Node = {
        label: byId(branch.suite).name,
        suite: branch.suite,
        x: 120,
        y: tips.length * 44 + 22,
        selected: branch.suite === selected,
        children: [],
      };
      if (node.selected) ancestry = parents;
      tips.push(node);
      return node;
    }
    const children = branch.children
      .map((b) => layout(b, depth + 1, [...parents, branch.label]))
      .filter((n): n is Node => n !== null);
    if (!children.length) return null;
    return {
      label: branch.label,
      x: 4 + depth * 12,
      y: (children[0].y + children[children.length - 1].y) / 2,
      selected: children.some((n) => n.selected),
      children,
    };
  };
  const root = layout(taxonomy, 0, []);
  const paths: string[] = [],
    active: string[] = [],
    nodes: string[] = [];
  const trace = (n: Node) => {
    if (n.children.length)
      nodes.push(
        `<circle cx="${n.x}" cy="${n.y}" r="2.4" class="${n.selected ? "selected-node" : ""}"><title>${n.label}</title></circle>`,
      );
    for (const child of n.children) {
      const path = `<path d="M${n.x} ${n.y}V${child.y}H${child.x}"/>`;
      paths.push(path);
      if (child.selected) active.push(path);
      trace(child);
    }
  };
  if (root) trace(root);
  const markup = root
    ? `<div class="branch-map"><svg class="branch-diagram" preserveAspectRatio="none" viewBox="0 0 120 ${tips.length * 44}" aria-hidden="true"><g class="tree-edges">${paths.join("")}</g><g class="active-edges">${active.join("")}</g><g class="tree-nodes">${nodes.join("")}</g></svg><ul class="tree-tips">${tips.map((n) => `<li class="species-leaf"><a href="#${n.suite}" data-species="${n.suite}" ${n.selected ? 'aria-current="page"' : ""}>${n.label}</a></li>`).join("")}</ul></div>${ancestry.length ? `<p class="tree-ancestry"><span>Selected ancestry</span>${ancestry.join(" / ")}</p>` : ""}`
    : "";
  return { markup, count: tips.length, ancestry };
}
