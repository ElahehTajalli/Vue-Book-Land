<template>
  <div id="app" :is="layout">
    <router-view/>
  </div>
</template>

<script>
const defaultLayout = 'outer'
export default {
  computed: {
    layout () {
      return `${(this.$route.meta.layout || defaultLayout)}-layout`
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/app.scss';
</style>
