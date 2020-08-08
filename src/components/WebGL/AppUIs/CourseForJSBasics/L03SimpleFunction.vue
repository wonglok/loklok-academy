<template>
  <div class="full">
    <LessonBarLayout>
      <LessonBarJSBasics slot="bar"></LessonBarJSBasics>
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
      code: `// refernece a number
var myNumber = 12345;
// refernece a string (words)
var myName = 'Lok Lok';
// refernece an object
var myObject = {};

console.log('myNumber is:', typeof myNumber);
console.log('myName is:', typeof myName);
console.log('myObject is:', typeof myObject);
`
    }
  }
}
</script>

<style>
</style>