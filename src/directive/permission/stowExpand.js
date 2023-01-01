export default {
  inserted: function(el, binding, vnode) {
    const charts = binding.value[0]
    el.addEventListener('click', () => {
      const vm = vnode.context
      vm[charts] = !vm[charts]
    })
  }
}