<template>
  <div>
    <div class="relative py-20">
      <div class="container mx-auto px-4">
        <div class="items-center flex flex-wrap">
        <div class="w-full md:w-4/12 ml-auto mr-auto px-4">
          <!-- <img
            alt="..."
            class="max-w-full rounded-lg shadow-lg"
            src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
          /> -->
          <GLArtCanvas class="h-full w-full flower-canvas-area rounded-lg" :rounded="'8px 8px 8px 8px'">
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
        <div class="w-full md:w-5/12 ml-auto mr-auto px-4 pt-24 md:pt-0">
          <div class="md:pr-12">
            <div
              class="text-pink-600 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-pink-300"
            >
              <i class="fas fa-rocket text-xl"></i>
            </div>
            <h3 class="text-3xl font-semibold">JavaScript Basics</h3>
            <p class="mt-4 text-lg leading-relaxed text-gray-600">
              The basics just like ABCs.
            </p>
            <p class="mt-4 text-lg leading-relaxed text-gray-600">
              JavaScript is the programming language of the web. We can use JavaScript to program with the Document Object Model (Web’s Elements) API or use it to draw 2D ART with Canvas2D API or Draw 3D Animation using WebGL API.
            </p>
            <ul class="list-none mt-6">
              <li class="py-2" v-for="(js, jsi) in jsbasics" :key="jsi">
                <div class="flex items-center">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200 mr-3"
                      ><i class="fas fa-check-circle"></i
                    ></span>
                  </div>
                  <router-link :to="`/lessons/js-basics/${js.path}`" class="block">
                    <h4 class="text-gray-600">
                      {{ js.name }}
                    </h4>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>