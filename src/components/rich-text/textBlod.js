import Quill from 'quill'
const Parchment = Quill.import('parchment')
class BoldStyleAttributor extends Parchment.Attributor.Style {
  value (domNode) {
    const value = super.value(domNode)
    return value
  }

  add (node, value) {
    console.dir(node, value)

    // $(node).css('font-weight', 'bold')
    node.style('font-weight', '700')
  }

  remove (node) {
    // $(node).css('font-weight', 'normal')
    node.removeAttribute('font-weight')
  }
}
const BoldStyle = new BoldStyleAttributor('bold', 'font-weight', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['bold'],
})

export default BoldStyle
