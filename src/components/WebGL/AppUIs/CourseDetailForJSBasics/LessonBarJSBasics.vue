<template>
  <div class="full overflow-scroll scrolling-touch">
    <router-link :to="`/lessons/js-basics/${lesson.path}`" class="p-3 block m-3 rounded-lg  shadow-md border" v-for="(lesson, li) in lessons" :key="li">
      {{ lesson.name }}
    </router-link>
  </div>
</template>

<script>
import { routes } from '../../../../router'
export default {
  data () {
    return {
      lessons: routes.find(r => r.path === '/lessons/js-basics').children.filter(e => e.path)
    }
  }
}
</script>

<style>

</style>