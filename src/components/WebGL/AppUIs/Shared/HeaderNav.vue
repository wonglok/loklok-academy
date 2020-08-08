<template>
  <div>
    <header class="text-gray-700 body-font border-b">
      <div class="w-full flex flex-wrap p-5 flex-row justify-between items-center">
        <router-link to="/" class="md:w-auto inline-flex title-font font-medium items-center justify-start text-gray-900">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg> -->
          <svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <title>Lok Lok Academy</title>
              <g id="Lok Lok Academy" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Lok Lok" transform="translate(-544.000000, -392.000000)" fill="#4371FF">
                      <g id="Lok-Lok-Academy" transform="translate(544.000000, 392.000000)">
                          <path d="M20,0 C31.045695,-2.02906125e-15 40,8.954305 40,20 C40,31.045695 31.045695,40 20,40 C8.954305,40 1.3527075e-15,31.045695 0,20 C-1.3527075e-15,8.954305 8.954305,2.02906125e-15 20,0 Z M20,3 C10.6111593,3 3,10.6111593 3,20 C3,29.3888407 10.6111593,37 20,37 C29.3888407,37 37,29.3888407 37,20 C37,10.6111593 29.3888407,3 20,3 Z" id="Combined-Shape"></path>
                          <path d="M14.097493,29 L19,11 L15.902507,11 L11,29 L14.097493,29 Z M14.0739154,29 L23.4789903,29 L22.6058384,26.2406844 L14.0739154,26.2406844 L14.0739154,29 Z M25.902507,29 L21,11 L24.097493,11 L29,29 L25.902507,29 Z" fill-rule="nonzero"></path>
                      </g>
                  </g>
              </g>
          </svg>
          <span class="ml-3 text-xl">Lok Lok Academy</span>
        </router-link>

        <nav class="hidden md:flex md:ml-auto flex-wrap items-center text-base justify-center">
          <span v-for="(link, idx) in main" :key="idx">
            <router-link v-if="link.type === 'router'" :exact-active-class="'underline'" class="mr-5 hover:text-gray-900" :to="`${link.path}`" :class="{ 'mr-5': idx !== main.length - 1 }">{{ link.name }}</router-link>
            <a v-if="link.type === 'external'" :href="link.path" target="_blank">
              {{ link.name }}
              <svg class="inline-block mx-1 scale-75 transform" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z"/></svg>
            </a>
          </span>
        </nav>

        <!-- <button class="hidden md:inline-flex items-center bg-gray-200 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0">Button
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button> -->

        <button @click="showMenu = !showMenu" class="inline-flex md:hidden items-center border-0 focus:outline-none py-1 px-1">
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z" fill="#1040e2"/><path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z"/></svg>
        </button>
      </div>
    </header>

    <transition name="fade">
      <div class="fixed top-0 right-0 w-full h-full z-40 bg-black opacity-50" v-show="showMenu" @click="showMenu = false"></div>
    </transition>

    <transition name="fade">
      <div v-show="showMenu" class="fixed top-0 right-0 menu-absolute-right h-full z-50 p-6">
        <div class="text-right">
          <svg class="inline-block" @click="showMenu = false" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></svg>
        </div>
        <div class="border-b border-black w-full pb-2 mb-3">Menu</div>
        <router-link class="block mb-4" to="/">Home</router-link>
        <router-link class="block mb-4" to="/course-catalogue">Course Catalogue</router-link>
        <a class="block mb-4" target="_blank" href="https://www.instagram.com/wonglok831/">Lok's Instagram</a>
        <div class="h-12"></div>
        <div class="border-b border-black w-full pb-2 mb-3" v-if="lessons.length > 0">{{ lessons[0].meta.courseName }}</div>
        <router-link class="mb-4" tag="div" :to="`${lesson.path}`" v-for="(lesson, idx) in lessons" :key="idx">
          {{ lesson.name }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import { getLessons } from '../../../../router'
export default {
  data () {
    return {
      showMenu: false,
      main: [
        {
          type: 'router',
          path: '/',
          name: 'Home'
        },
        {
          type: 'router',
          path: '/course-catalogue',
          name: 'Course Catalogue'
        }
      ],
      lessons: getLessons()
    }
  }
}
</script>

<style lang="postcss">
body{
  overflow-x: hidden;
}
.menu-absolute-right{
  width: 285px;
  background-color: white;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
