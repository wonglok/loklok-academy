<template>
  <div class="full overflow-scroll scrolling-touch">
    <router-link :to="`${lesson.path}`" exact-active-class="bg-gray-300" class="px-3 py-4 block text-sm border-b" v-for="(lesson, li) in lessons" :key="li">
      {{ pad(li + 1, 2) }} {{ lesson.name }}
    </router-link>
  </div>
</template>

<script>
import { courses } from '../../../../router'
export default {
  data () {
    let oneCourse = courses.find(c => c.meta.prefix === this.$route.meta.prefix)
    let lessons = []
    if (oneCourse) {
      lessons = oneCourse.children.filter(e => !e.redirect)
        .map(e => {
          let newItem = JSON.parse(JSON.stringify(e))
          newItem.name = newItem.name.slice(3, newItem.name.length)
          return newItem
        })
    }
    return {
      lessons
    }
  },
  methods: {
    pad (n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
  }
}
</script>

<style>

</style>