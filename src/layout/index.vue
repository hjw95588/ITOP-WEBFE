<template>
  <div>
    <vertical-mode v-if="navbarMode === 'vertical'" />
    <horizontal-mode v-if="navbarMode === 'horizontal'" />
    <mixed-mode v-if="navbarMode === 'mixed'" />
  </div>
</template>

<script>
import VerticalMode from './VerticalMode.vue'
import HorizontalMode from './HorizontalMode.vue'
import MixedMode from './MixedMode.vue'
export default {
  name: 'Layout',
  components: {
    VerticalMode,
    HorizontalMode,
    MixedMode
  },
  computed: {
    navbarMode () {
      return this.$store.state.settings.navbarMode
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>
