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
        age: 26
    },
    {
        name: 'Siu Ming',
        age: 30
    },
    {
        name: 'Dai Ming',
        age: 50
    },
    {
        name: 'Heather',
        age: 24
    },
];

console.log('Students over 35:',
    students.filter(function(item){
        return item.age > 35;
    })
);

console.log('Sum of age:',
    students.reduce(function(accumulator, item){
        return accumulator + item.age;
    }, 0)
);

console.log('Map',
    students.map(function(item){
        var age = item.age;

        if (age >= 50){
            return 'Elderly';
        }else if (age >= 30){
            return 'Adult';
        }else if (age > 18){
            return 'Young Adult';
        }else {
            return 'Teens and Kids';
        }
    })
);
`
    }
  }
}
</script>

<style>
</style>