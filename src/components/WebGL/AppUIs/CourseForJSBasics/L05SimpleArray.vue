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
      code: `var students = [
  {
      name: 'wonglok',
      age: 26
  },
  {
      name: 'siu ming',
      age: 27
  }
];

console.log(students[0]);
console.log(students[1]);

//add a new student
students.push({
    name: 'Heather',
    age: 20
});
console.log(students[2]);
`
    }
  }
}
</script>

<style>
</style>