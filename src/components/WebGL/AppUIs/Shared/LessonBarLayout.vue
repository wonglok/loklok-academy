<template>
  <div class="full h-full w-full flex flex-col md:flex-row">
    <div class="left-lesson-bar hidden md:block">
      <slot name="bar"></slot>
    </div>
    <div class="right-lesson-box border-l h-full">
      <slot name="box"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      openMenu: true,
      isMobile: window.innerWidth < 500
    }
  }
}
</script>

<style lang="postcss">
.half-h{
  height: 50%;
}
@screen lg {
  .half-h {
    height: 100%;
  }
  .left-lesson-bar{
    width: 250px;
  }
  .right-lesson-box{
    width: calc(100% - 250px);
  }
}

</style>