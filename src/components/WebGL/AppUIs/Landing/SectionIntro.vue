<template>
  <section class="pb-20 bg-gray-300 -mt-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap">
        <div class="lg:pt-6 pt-6 w-full md:w-4/12 px-4 text-center">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
          >
            <div class="px-4 py-5 flex-auto">
              <div
                class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400"
              >
                <i class="fas fa-award"></i>
              </div>
              <h6 class="text-xl font-semibold">All Coding Tutorials are Free</h6>
              <p class="mt-2 mb-4 text-gray-600">
                I love learning tutorials from the internet for free. I would also like to give back to our community!
              </p>
            </div>
          </div>
        </div>

        <div class="w-full md:w-4/12 px-4 text-center">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
          >
            <div class="px-4 py-5 flex-auto">
              <div
                class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400"
              >
                <i class="fas fa-calendar-check"></i>
              </div>
              <h6 class="text-xl font-semibold">From Easy to In-Depth</h6>
              <p class="mt-2 mb-4 text-gray-600">
                It's only a matter of time that you will master the Web Platform Technology.
              </p>
            </div>
          </div>
        </div>
        <div class="lg:pt-6 w-full md:w-4/12 px-4 text-center">
          <div
            class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
          >
            <div class="px-4 py-5 flex-auto">
              <div
                class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400"
              >
                <i class="fas fa-fingerprint"></i>
              </div>
              <h6 class="text-xl font-semibold">JavaScript Fantasy Land</h6>
              <p class="mt-2 mb-4 text-gray-600">
                Nowadays, who doesn't love JavaScript?! It's in front end and backend server and desktop application such as electron and nwjs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center mt-32">
        <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
          <div
            class="text-gray-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-100"
          >
            <i class="fas fa-book-reader text-xl"></i>
          </div>
          <h3 class="text-3xl mb-2 font-semibold leading-normal">
            Let's explore the possibilities within our Browser.
          </h3>
          <!-- <p
            class="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-700"
          >
          </p> -->
          <div
            class="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-700"
          >
            <div class="mb-3">
              Courses on Front End Technologies:
            </div>
            <ul class="pl-6 list-disc">
              <li class="">
                JavaScript Basics (In Progress)
              </li>
              <li class="">
                ES6 Basics (In Progress)
              </li>
              <li class="">
                Canvas Basics (In Progress)
              </li>
              <li class="">
                WebGL Concept Basics (In Progress)
              </li>
              <li class="">
                ThreeJS Basic Level (In Progress)
              </li>
              <li class="">
                ThreeJS Intermediate Level (In Progress)
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full md:w-4/12 px-4 mr-auto ml-auto">

          <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-pink-600"
          >
            <!-- <img
              alt="..."
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80"
              class="w-full align-middle rounded-t-lg"
            /> -->
            <div class="w-full align-middle rounded-t-lg h-64">
              <GLArtCanvas class="h-full w-full">
                <Bloomer :settings="{
                  exposure: 1.0,
                  bloomStrength: 1.7,
                  bloomThreshold: 20.72 / 100.0,
                  bloomRadius: 72.99 / 100.0 * 2
                }"></Bloomer>

                <FastFlame :sx="3.6" :lowres="true"></FastFlame>
              </GLArtCanvas>
            </div>
            <blockquote class="relative p-8 mb-4">
              <!-- <svg
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 583 95"
                class="absolute left-0 w-full block"
                style="height: 95px; top: -94px;"
              >
                <polygon
                  points="-30,95 583,95 583,65"
                  class="text-pink-600 fill-current"
                ></polygon>
              </svg> -->
              <h4 class="text-xl font-bold text-white">
                From Zero to Hero
              </h4>
              <p class="text-md font-light mt-2 text-white">
                It's always intimidating to do what requires time and proper training. But with preserverernce and every lesson on the journey, you are getting progress and closer and closer to your goal everyday.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ]
}
</script>

<style>

</style>