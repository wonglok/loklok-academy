<template>
  <div class="full">
    <LessonBarLayout>
      <LessonBar slot="bar"></LessonBar>
      <div slot="box" class="h-full">
        <DOMEditor :code="code" :NS="code" :key="code" class="h-full w-full"></DOMEditor>
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
      code: `const YELLOW_MAT_CAP = "${location.origin}${require('./img/matcap-bright-yellow.png')}";
${require('raw-loader!./txt/threejs-box-matcap.txt').default}`
    }
  },
  mounted () {
  }
}
</script>

<style>

</style>