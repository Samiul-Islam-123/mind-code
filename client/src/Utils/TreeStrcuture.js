function buildTree(paths, Projectname){
   
    const root = { name: Projectname, toggled: true, children: [] };


     paths.forEach(path => {
         const parts = path.split("\\").slice(8);
         let current = root;

         parts.forEach((part, index) => {
            let node = current.children.find(child => child.name === part);
            if (!node) {
                node = { name: part , toggled : true};
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