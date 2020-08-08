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
      code: `function addAge(a, b){
    var result;
    result = a + b;
    return result;
}

function addName(firstName, secondName){
    var result;

    result = firstName + ' & ' + secondName;

    return result;
}

var lokAge = 10, peterAge = 15;
console.log('variable add', addAge(lokAge, peterAge));
console.log('inline number add', addAge(20,30));
console.log('add name', addName('lok', 'siu ming'));

`
    }
  }
}
</script>

<style>
</style>