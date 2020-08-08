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
      code: `//Babel 6
class Vector2D{

    //define members of a new object
    constructor(myX, myY){
        //'this' points to the newly created object.
        this.x = myX;
        this.y = myY;
    }

    //methods = functions of an object.
    add(anotherVector){
        this.x = this.x + anotherVector.x;
        this.y = this.y + anotherVector.y;
        return this;
    }
}


var myVector1 = new Vector2D(1,2);
var myVector2 = new Vector2D(3,4);
console.log('What is myVector1:', myVector1);
console.log('Vector1 add Vector2',myVector1.add(myVector2));
`
    }
  }
}
</script>

<style>

</style>