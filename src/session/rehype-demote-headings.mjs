// The page already has its title as the one <h1>. A Markdown body that uses `#` for its own sections
// gets every heading one level down (h1→h2 … h5→h6); bodies that start at `##` are left alone.
const HEADING = /^h([1-6])$/

function walk(node, visit) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

export default function rehypeDemoteHeadings() {
  return (tree) => {
    let hasH1 = false
    walk(tree, (n) => {
      if (n.type === 'element' && n.tagName === 'h1') hasH1 = true
    })
    if (!hasH1) return
    walk(tree, (n) => {
      const m = n.type === 'element' && HEADING.exec(n.tagName)
      if (m) n.tagName = `h${Math.min(6, Number(m[1]) + 1)}`
    })
  }
}
