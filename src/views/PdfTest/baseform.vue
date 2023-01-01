<template>
  <div>
    <div>我是子组件form: {{ form }}</div>
    <DeaparTure :deaparture="form"></DeaparTure>
  </div>
</template>

<script>
import DeaparTure from './deaparture.vue'
export default {
  name: 'BaseForm',
  components: { DeaparTure },
  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>