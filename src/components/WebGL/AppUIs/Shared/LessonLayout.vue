<template>
  <div class="full">
    <HeaderNav class="header-nav">
    </HeaderNav>
    <div class="nav-content-area">
      <router-view></router-view>
    </div>
    <AvatarBox v-if="largeScreen" :key="'avatarbox'" class="absolute left-0 z-10 leftbar"></AvatarBox>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue.js').O3DVue
  ],
  data () {
    return {
      largeScreen: window.innerWidth >= 1024
    }
  }
}
</script>

<style lang="postcss">
.header-nav{
  height: 81px;
}
.nav-content-area{
  height: calc(100% - 81px);
}
.leftbar{
  width: 250px;
  height: 250px;
  bottom: 50px;
  /* border: red solid 1px; */
}
</style>