<template>
  <div>
    <div class="course-banner relative">
      <GLArtCanvas :rounded="'0px 0px 0px 0px'" class="full" bgcolor="#000000">
        <MBLinesBloom></MBLinesBloom>
        <Bloomer :settings="{
          exposure: 1.0,
          bloomStrength: 2,
          bloomThreshold: 10.72 / 100.0,
          bloomRadius: 50.99 / 100.0 * 2
        }"></Bloomer>
      </GLArtCanvas>
      <div class="absolute course-banner-overlay top-0 left-0 w-full h-full flex justify-center items-center">
        <div class="text-white text-2xl lg:text-5xl">Course Catalogue</div>
      </div>
    </div>

    <section class="text-gray-700 body-font max-w-5xl mx-auto">
      <div class="container px-5 py-24 mx-auto flex flex-wrap">
        <div class="flex flex-wrap w-full">
          <div class="md:w-1/2 lg:w-2/5 md:pr-10 md:py-6">
            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">JavaScript Basics</h2>
                <p class="leading-relaxed">
                  Basic Logic and Code Organisation.
                </p>
              </div>
            </div>
            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">ES6 Basics</h2>
                <p class="leading-relaxed">String Templates, Class, Arrow Functions.</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">DOM Bascis</h2>
                <p class="leading-relaxed">Document Object Model is the Structure behind a Web page. In this unit, we will be learning about basic animation of a web page</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Canvas 2D Basics</h2>
                <p class="leading-relaxed">We will learn about drawing basic shapes in 2D such as cricles and lines.</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">WebGL Concept Basics</h2>
                <p class="leading-relaxed">We will learn about the journey of a partcile from code to pixel on screen.</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">THREE JS Bascis</h2>
                <p class="leading-relaxed">We will be using THREE.JS to make some basic WebGL Rendering.</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">THREE JS Intermediate</h2>
                <p class="leading-relaxed">We will be using THREE.JS to make some basic Custom Shader WebGL.</p>
              </div>
            </div>

            <div class="flex relative pb-12">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <i class="fa fa-asterisk"></i>
              </div>
              <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">THREE JS Advanced</h2>
                <p class="leading-relaxed">We will be using THREE.JS to make some custom GPGPU WebGL ART.</p>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/2 lg:w-3/5 rounded-lg md:mt-0 mt-12">
            <div class="course-catalogue-art rounded-lg ">
              <GLArtCanvas class="h-full w-full rounded-lg" :rounded="'8px 8px 8px 8px'">
                <!-- <Bloomer :settings="{
                  exposure: 1.0,
                  bloomStrength: 1.7,
                  bloomThreshold: 20.72 / 100.0,
                  bloomRadius: 72.99 / 100.0 * 2
                }"></Bloomer> -->

                <GLFlower></GLFlower>

                <!-- <EnergyArt :pz="50" :lowres="true"></EnergyArt> -->
                <!-- <FastFlame :sx="3.6" :lowres="true"></FastFlame> -->
              </GLArtCanvas>
            </div>
          </div>
          <!-- <img class="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://dummyimage.com/1200x500" alt="step"> -->
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { routes } from '../../../../router'
export default {
  mixins: [
    require('../../Core/O3DVue').O3DVue
  ],
  data () {
    return {
      jsbasics: routes.find(r => r.path === '/lessons/js-basics').children
    }
  }
}
</script>

<style lang="postcss">
.course-banner{
  height: 70vmin;
}
.course-banner-overlay{
  background-color: rgba(0, 0, 0, 0.185);
}

.course-catalogue-art{
  height: 500px;
  background-image: url(./img/cherry.jpg);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-color: #142f79;
}
/* @screen lg{
  .course-catalogue-art{
    height: 100%;
  }
} */
</style>