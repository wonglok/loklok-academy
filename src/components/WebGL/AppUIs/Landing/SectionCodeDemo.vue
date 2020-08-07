<template>
  <div class="editor-area border-t border-b border-green-500">
    <O3DEditor class="h-full w-full"></O3DEditor>
  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ]
}
</script>

<style lang="postcss">
.editor-area{
  height: 75vh;
}
</style>