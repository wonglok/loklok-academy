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
      code: `var robotFactory = function (){
    var api = {};
    var robot = {
        name: 'lok',
        takes: [{
          subject: 'English',
          score: 89
        }]
    };

    api.getRobot = function () {
      return robot
    };

    return api;
};

let factory = robotFactory();
console.log(factory.getRobot());
`
    }
  }
}
</script>

<style>
</style>