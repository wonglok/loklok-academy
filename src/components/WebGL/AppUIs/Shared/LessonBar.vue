<template>
  <div class="full overflow-scroll scrolling-touch relative">
    <router-link to="/course-catalogue" class="hover px-3 py-4 block text-center text-sm border-b bg-gray-200">
      <div class="inline-block loopsy">← Back to Catalogue</div>
    </router-link>

    <div class="px-3 py-4 block text-sm border-b bg-green-300 hover:bg-green-200 text-center" v-if="lessons && lessons[0]">
      {{ lessons[0].meta.courseName }}
    </div>
    <router-link :to="`${lesson.path}`" exact-active-class="bg-teal-300" class=" hover:bg-teal-100 transition-colors duration-500 px-3 py-4 block text-sm border-b" v-for="(lesson, li) in lessons" :key="li">
      {{ pad(li + 1, 2) }} {{ lesson.name }}
    </router-link>


    <router-link :to="nextCourse.path" class="px-3 py-4 block text-sm border-b bg-green-300 hover:bg-green-200 text-center absolute left-0 w-full bottom-0" v-if="nextCourse">
      Up Next: {{ nextCourse.meta.courseName }}
    </router-link>
  </div>
</template>

<script>
import { courses } from '../../../../router'
export default {
  data () {
    let oneCourse = courses.find(c => c.meta.prefix === this.$route.meta.prefix)
    let currentCouseIdx = courses.findIndex(c => c.meta.prefix === this.$route.meta.prefix)
    let nextCourse = courses[currentCouseIdx + 1]
    let previousCourse = courses[currentCouseIdx - 1]
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
      previousCourse,
      nextCourse,
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

<style lang="postcss">
@keyframes loopsy {
  0% {
    transform: translateX(200%);
  }
  100% {
    transform: translateX(-200%);
  }
}
@keyframes blink {
  0% {
    @apply bg-blue-600 text-white;
  }
  50% {
    @apply bg-blue-100 text-blue-600;
  }
  100% {
    @apply bg-blue-600 text-white;
  }
}

.hover:hover .loopsy{
  animation: loopsy 2s linear 0s infinite normal both;
}
.b-54{
  bottom: 54px;
}
</style>