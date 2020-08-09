<template>
  <div class="full">
    <LessonBarLayout>
      <LessonBar slot="bar"></LessonBar>
      <div slot="box" class="h-full">
        <div class="toolbar flex items-center">
          <button class="text-xs m-1 p-1 border rounded-full px-3 cursor-pointer hover:bg-green-400" @click="() => $refs['dom-editor'].$emit('run')">Run Code</button>
        </div>
        <div class="editor">
          <DOMEditor ref="dom-editor" :code="code" :NS="code" :key="code" class="h-full w-full"></DOMEditor>
        </div>
      </div>
    </LessonBarLayout>
  </div>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue'
export default {
  mixins: [
    O3DVue
  ],
  data () {
    return {
      file: this.$options.__file,
      code: `const SPIRAL_IMG_URL = "${location.origin}${require('./img/spiral.jpg')}";
${require('!raw-loader!./txt/shader-noise.js').default}`
    }
  },
  mounted () {
  }
}
</script>

<style lang="postcss">
.toolbar{
  height: 37px;
}
.editor{
  height: calc(100% - 37px);
}
</style>