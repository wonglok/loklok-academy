<template>
  <section class="relative py-20">
    <div
      class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20"
      style="height: 80px; transform: translateZ(0px);"
    >
      <svg
        class="absolute bottom-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        version="1.1"
        viewBox="0 0 2560 100"
        x="0"
        y="0"
      >
        <polygon
          class="text-white fill-current"
          points="2560 0 2560 100 0 100"
        ></polygon>
      </svg>
    </div>
    <div class="container mx-auto px-4">
      <div class="items-center flex flex-wrap">
        <div class="w-full md:w-4/12 ml-auto mr-auto px-4">
          <!-- <img
            alt="..."
            class="max-w-full rounded-lg shadow-lg"
            src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
          /> -->
          <GLArtCanvas class="h-full w-full progress-canvas-area rounded-lg" :rounded="'8px 8px 8px 8px'">
            <!-- <Bloomer :settings="{
              exposure: 1.0,
              bloomStrength: 1.7,
              bloomThreshold: 20.72 / 100.0,
              bloomRadius: 72.99 / 100.0 * 2
            }"></Bloomer> -->
            <EnergyArt :pz="50" :lowres="true"></EnergyArt>
            <!-- <FastFlame :sx="3.6" :lowres="true"></FastFlame> -->
          </GLArtCanvas>
        </div>
        <div class="w-full md:w-5/12 ml-auto mr-auto px-4 pt-24 md:pt-0">
          <div class="md:pr-12">
            <div
              class="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-pink-300"
            >
              <i class="fas fa-rocket text-xl"></i>
            </div>
            <h3 class="text-3xl font-semibold">Progress over perfection.</h3>
            <p class="mt-4 text-lg leading-relaxed text-gray-600">
              Keep Trying, because heaven inspires you with your work.
            </p>
            <ul class="list-none mt-6">
              <li class="py-2">
                <div class="flex items-center">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      ><i class="fas fa-fingerprint"></i
                    ></span>
                  </div>
                  <div>
                    <h4 class="text-gray-600">
                      Staring Coding. It can remove irrational fear.
                    </h4>
                  </div>
                </div>
              </li>
              <li class="py-2">
                <div class="flex items-center">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      ><i class="fab fa-html5"></i
                    ></span>
                  </div>
                  <div>
                    <h4 class="text-gray-600">
                      Don't just read code online.
                    </h4>
                  </div>
                </div>
              </li>
              <li class="py-2">
                <div class="flex items-center">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      ><i class="far fa-paper-plane"></i
                    ></span>
                  </div>
                  <div>
                    <h4 class="text-gray-600">
                      Type some Code by hand, not by copy and paste examples.
                    </h4>
                  </div>
                </div>
              </li>
            </ul>
          </div>
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