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
      code: require('!raw-loader!./txt/threejs-box-flatshading.js').default
    }
  },
  mounted () {
  }
}
</script>

<style>

</style>