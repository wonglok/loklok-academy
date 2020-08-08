<template>
  <div class="full h-full w-full flex">
    <div class="left-lesson-bar h-full">
      <slot name="bar"></slot>
    </div>
    <div class="right-lesson-box h-full border-l">
      <slot name="box"></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.left-lesson-bar{
  width: 275px;
}
.right-lesson-box{
  width: calc(100% - 275px);
}
</style>