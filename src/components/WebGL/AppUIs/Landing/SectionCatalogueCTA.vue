<template>
  <section class="relative pb-24 pt-12">
    <div class="container mx-auto px-4">
      <div class="items-center flex flex-wrap justify-center">
        <div class="w-full md:w-4/12 px-4 text-center inline-block">
          <router-link
            to="/course"
            class="relative cursor-pointer flex flex-col min-w-0 break-words bg-white w-full mb-8 border shadow-lg rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            <div class="px-4 py-5 flex-auto -mt-12">
              <div
                class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-teal-400"
              >
                <i class="fas fa-icons"></i>
              </div>
              <h6 class="text-xl font-semibold">View Course Catalogue</h6>
              <p class="mt-2 mb-4 text-gray-600">
                Let's begin your journey of developing your dream web app today.
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { O3DVue } from '../../Core/O3DVue'
export default {
  mixins: [
    O3DVue
  ]
}
</script>

<style>
.progress-canvas-area{
  height: 500px;
  background-image: url(./img/skyspace.jpg);
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-color: #142f79;
}
</style>