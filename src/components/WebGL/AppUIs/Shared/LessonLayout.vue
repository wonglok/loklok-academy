<template>
  <div class="full">
    <HeaderNav class="header-nav"></HeaderNav>
    <div class="nav-content-area">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue.js').O3DVue
  ]
}
</script>

<style lang="postcss">
.header-nav{
  height: 81px;
}
.nav-content-area{
  height: calc(100% - 81px);
}
</style>