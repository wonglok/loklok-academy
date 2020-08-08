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
      code: `var lok = {
    name: 'wonglok',
    age: 23
};

console.log(lok.name, lok.age);
lok.age = 26; //update the age.

console.log(lok.name, lok.age, '(new age)');
`
    }
  }
}
</script>

<style>
</style>