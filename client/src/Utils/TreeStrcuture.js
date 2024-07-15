function buildTree(paths, Projectname){
    console.log(paths);
    const root = { name: Projectname, toggled: true, children: [] };

    paths.forEach(path => {
        const parts = path.split("/").slice(8); // Adjust the slice as needed for your use case
        let current = root;

        parts.forEach((part, index) => {
            if (!current.children) {
                current.children = [];
            }

            let node = current.children.find(child => child.name === part);
            if (!node) {
                node = { name: part, toggled: true, parent: current };
                if (index < parts.length - 1) {
                    node.children = [];
                }
                current.children.push(node);
            }
            current = node;
        });
    });

    return root;
}

export default buildTree;
