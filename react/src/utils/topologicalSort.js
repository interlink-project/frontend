export function topologicalSort(treeitems) {
  const visited = new Set();
  const treeitemMap = new Map(treeitems.map((treeitem) => [treeitem.id, treeitem]));

  function dfs(items) {
    for (const treeitem of items) {
      if (!visited.has(treeitem.id)) {
        dfs(treeitem.prerequisites_ids.map((id) => treeitemMap.get(id)));
      }
      visited.add(treeitem);
    }
  }

  dfs(treeitems);
  return [...visited];
}
