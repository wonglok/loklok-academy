<template>
  <div>
    <HeaderNav></HeaderNav>
    <div class="course-banner relative">
      <GLArtCanvas :rounded="'0px 0px 0px 0px'" class="full" bgcolor="#000000">
        <!-- <MBLinesBloom></MBLinesBloom> -->
        <Bloomer :settings="{
          exposure: 1.0,
          bloomStrength: 2,
          bloomThreshold: 10.72 / 100.0,
          bloomRadius: 50.99 / 100.0 * 2
        }"></Bloomer>
        <FastFlame :sx="3.6"></FastFlame>
      </GLArtCanvas>
      <div class="absolute course-banner-overlay top-0 left-0 w-full h-full flex flex-col justify-center items-center">
        <div class="text-white text-2xl lg:text-4xl">Not Found</div>
        <div class="text-white text-xl lg:text-3xl">or</div>
        <div class="text-white text-2xl lg:text-4xl">Under Development</div>
        <div class="text-white underline mt-12 cursor-pointer" @click="$router.go(-1)">Let's Go Back</div>
      </div>
    </div>

    <section class="text-gray-700 body-font max-w-5xl mx-auto">
      <div class="container px-5 py-24 mx-auto flex flex-wrap">
        <div class="flex flex-wrap w-full">
          <div class="w-full rounded-lg md:mt-0 mt-12">
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
    <SectionFooter></SectionFooter>
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
  height: 60vh;
}
.course-banner-overlay{
  background-color: rgba(0, 0, 0, 0.185);
}

.course-catalogue-art{
  position: sticky;
  top: 30px;
  height: 550px;
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