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
      code: `if (true){
    // run
    console.log('1');
}
if (false){
	//don't run
	console.log('2');
}


if (false){
  console.log('3');
} else {
	console.log('4');
}

if (false){
    //wont run
    console.log('5');
} else if (true) {
    //run
    console.log('6');
} else {
    //wont run
    console.log('7');
}
`
    }
  }
}
</script>

<style>
</style>