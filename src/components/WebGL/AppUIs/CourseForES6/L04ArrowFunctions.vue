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
      code: `
        function Parent(){
          this.name = 'Mum';
          var self = this;

          this.kid = {
              name: 'Kit',

              //***Dangerous Code***
              //Banned by Google ES5 Style
              dynamicThisFunction: function(){
                  console.log(this.name);
              },

              //**********************
              //*** Recommend this ***
              //**********************
              //Safely referring to parent object
              //1. Safer
              //2. Write less code.
              arrowFunction: () => {
                  console.log(this.name);
              },


              //Safely referring to parent object
              //But... Write more code... in parent scope.
              selfFunction: function(){
                  console.log(self.name);
              },

              //Safely Binded parent object, Google ES5 Style
              //But... sometimes we might forget to bind the function
              bindedFunction: function(){
                  console.log(this.name);
              }.bind(this)

          };

      }

      var mom = new Parent();

      mom.kid.dynamicThisFunction();
      mom.kid.arrowFunction();
      mom.kid.selfFunction();
      mom.kid.bindedFunction();
      `
    }
  }
}
</script>

<style>

</style>