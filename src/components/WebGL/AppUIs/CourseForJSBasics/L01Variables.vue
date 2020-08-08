<template>
  <div class="full">
    <LessonBarLayout>
      <LessonBar slot="bar"></LessonBar>
      <div slot="box" class="h-full">
        <JSEditor :code="code" :NS="code" :key="code" class="h-full w-full"></JSEditor>
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
      code: `// your first variable named "a"
var a = 1;
// your second variable named "a"
var b = 2;

// check the value of variable "a"
console.log(a);
// check the value of variable "b"
console.log(b);

// check the value of variable "a" added with variable "b"
console.log(a + b);
`
    }
  }
}
</script>

<style>

</style>