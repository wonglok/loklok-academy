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
      code: `var students = [
    {
        name: 'Lok',
        age: 24
    },
    {
        name: 'Siu Ming',
        age: 26
    },
    {
        name: 'Dai Ming',
        age: 30
    },
    {
        name: 'Heather',
        age: 50
    },
];

console.log('Students over 35:',
    students.filter(function(item){
        return item.age > 35;
    })
);

console.log('Lok',
    students.find(function(item){
        return item.name === 'Lok';
    })
);

console.log('Sum of age:',
    students.reduce(function(accumulator, item){
        return accumulator + item.age;
    }, 0)
);

console.log('Map',
    students.map(function(item){
      return item.name
    })
);
`
    }
  }
}
</script>

<style>
</style>