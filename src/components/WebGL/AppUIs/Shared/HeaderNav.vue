<template>
  <div>
    <header class="text-gray-700 body-font border-b">
      <div class="w-full flex flex-wrap p-5 flex-row justify-between items-center">
        <router-link to="/" class="md:w-auto inline-flex title-font font-medium items-center justify-start text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span class="ml-3 text-xl">Lok Lok Academy</span>
        </router-link>

        <nav class="hidden md:flex md:ml-auto flex-wrap items-center text-base justify-center">
          <span v-for="(link, idx) in main" :key="idx">
            <router-link v-if="link.type === 'router'" class="mr-5 hover:text-gray-900" :to="`${link.path}`" :class="{ 'mr-5': idx !== main.length - 1 }">{{ link.name }}</router-link>
            <a v-if="link.type === 'external'" :href="link.path" target="_blank">{{ link.name }}</a>
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
      <div v-show="showMenu" class="fixed top-0 right-0 menu-right h-full z-50 p-6">
        <div class="text-right">
          <svg class="inline-block" @click="showMenu = false" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/></svg>
        </div>
        <div class="border-b border-black w-full pb-2 mb-3">Menu</div>
        <a href="https://www.linkedin.com/in/wonglok831/">Open for Commission</a>
        <div class="h-12"></div>
        <div class="border-b border-black w-full pb-2 mb-3">Course</div>
        <router-link class="mb-4" tag="div" :to="`/course/${link.path}`" v-for="(link, idx) in course" :key="idx">
          {{ link.name }}
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import { routes } from '../../../../router'
export default {
  data () {
    return {
      showMenu: false,
      main: [
        // {
        //   type: 'router',
        //   path: '/course',
        //   name: 'Course Catalogue'
        // },
        {
          type: 'external',
          path: 'https://www.linkedin.com/in/wonglok831/',
          name: 'Open for Commission'
        }
      ],
      course: [
        ...routes.find(e => e.path === '/course').children
      ]
    }
  }
}
</script>

<style lang="postcss">
body{
  overflow-x: hidden;
}
.menu-right{
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
