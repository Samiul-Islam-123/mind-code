// src/utils.js
export const buildFileTree = (paths, projectName) => {
  const nodes = [];
  const edges = [];
  const root = {};

  // Filter and process paths to make them relative to the project name
  const relativePaths = paths
    .filter(path => path.includes(projectName))
    .map(path => path.split(`${projectName}\\`)[1]);

  // Build the nested directory structure
  relativePaths.forEach((path) => {
    const parts = path.split('\\');
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = { children: {}, label: part }; // Store label for displaying in nodes
      }
      if (index === parts.length - 1) {
        current[part].isFile = true;
      }
      current = current[part].children;
    });
  });

  // Traverse the nested structure to create nodes and edges with hierarchical positioning
  const traverse = (node, parentId = null, depth = 0, xOffset = 0) => {
    let y = depth * 100; // Vertical spacing

    Object.keys(node).forEach((key, index) => {
      const id = `${parentId ? parentId + '-' : ''}${key}`;
      const x = xOffset + index * 200; // Horizontal spacing

      nodes.push({
        id,
        data: { label: node[key].label }, // Use label for displaying node label
        position: { x, y },
      });

      if (parentId) {
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: true,
        });
      }

      if (!node[key].isFile) {
        traverse(node[key].children, id, depth + 1, xOffset + index * 200);
      }
    });
  };

  traverse(root);

  return { nodes, edges };
};
