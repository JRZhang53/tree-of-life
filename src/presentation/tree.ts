import { species, byId, type SpeciesId } from "../catalog.ts";
import { taxonomy, type Branch } from "../content/taxonomy.ts";

type Node = {
  label: string;
  suite?: SpeciesId;
  depth: number;
  row: number;
  selected: boolean;
  children: Node[];
};

/** Two projections of the same selected topology; distances never encode time. */
export function treeView(selected: SpeciesId, query = "") {
  const matches = new Set(
    species
      .filter((s) =>
        `${s.name} ${s.latin} ${s.family} ${s.title} ${s.question} ${s.algorithm} ${s.modes.join(" ")}`
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
        depth,
        row: tips.length,
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
      depth,
      row: (children[0].row + children.at(-1)!.row) / 2,
      selected: children.some((n) => n.selected),
      children,
    };
  };
  const root = layout(taxonomy, 0, []);
  const diagram = (vertical: boolean) => {
    const paths: string[] = [],
      active: string[] = [],
      nodes: string[] = [];
    const point = (n: Node) =>
      vertical
        ? { x: n.suite ? 120 : 4 + n.depth * 12, y: n.row * 96 + 48 }
        : { x: n.row * 100 + 50, y: n.suite ? 0 : 190 - n.depth * 25 };
    const trace = (n: Node) => {
      const p = point(n);
      if (n.children.length)
        nodes.push(
          `<circle cx="${p.x}" cy="${p.y}" r="2.5" class="${n.selected ? "selected-node" : ""}"><title>${n.label}</title></circle>`,
        );
      for (const child of n.children) {
        const c = point(child);
        const d = vertical
          ? `M${p.x} ${p.y}V${c.y}H${c.x}`
          : `M${p.x} ${p.y}V${p.y - 10}Q${p.x} ${p.y - 18} ${p.x + Math.sign(c.x - p.x) * 8} ${p.y - 18}H${c.x}V${c.y}`;
        const path = `<path d="${d}"/>`;
        paths.push(path);
        if (child.selected) active.push(path);
        trace(child);
      }
    };
    if (root) trace(root);
    return `<svg class="branch-diagram ${vertical ? "vertical-tree" : "wide-tree"}" preserveAspectRatio="none" viewBox="0 0 ${vertical ? 120 : tips.length * 100} ${vertical ? tips.length * 96 : 210}" aria-hidden="true"><g class="tree-edges">${paths.join("")}</g><g class="active-edges">${active.join("")}</g><g class="tree-nodes">${nodes.join("")}</g></svg>`;
  };
  const markup = root
    ? `<div class="branch-map" style="--tip-count:${tips.length}">${diagram(false)}${diagram(true)}<ul class="tree-tips">${tips.map((n) => `<li class="species-leaf"><a href="#${n.suite}" data-species="${n.suite}" ${n.selected ? 'aria-current="page"' : ""}><span class="specimen-preview"><img data-preview="${n.suite}" alt="" width="180" height="112"></span><span>${n.label}</span></a></li>`).join("")}</ul><span class="tree-root" style="--root-position:${((root.row + 0.5) / tips.length) * 100}%">Life</span></div>`
    : "";
  return { markup, count: tips.length, ancestry };
}
