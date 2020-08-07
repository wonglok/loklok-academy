<template>
  <div class="full">
    <HeaderNav></HeaderNav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue.js').O3DVue
  ]
}
</script>

<style>
</style>