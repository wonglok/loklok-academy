<template>
  <div class="full relative">
    <div class="absolute z-10 top-0 left-0 full overflow-auto scrolling-touch">

      <div ref="glarea" class="h-full w-full">
        <MoveGridBlock class="relative cursor-pointe inline-block" @click="$emit('play', paged[0].displayName)" :style="{ width: size, height: size }">
          <StandardLights></StandardLights>
          <GameNPC :camLock="true" :char="'glassman'" :move="paged[0].displayName"></GameNPC>
        </MoveGridBlock>
        <MoveGridBlock class="relative cursor-pointe inline-block" @click="$emit('play', paged[1].displayName)" :style="{ width: size, height: size }">
          <StandardLights></StandardLights>
          <GameNPC :camLock="true" :char="'glassman'" :move="paged[1].displayName"></GameNPC>
        </MoveGridBlock>
        <MoveGridBlock class="relative cursor-pointe inline-block" @click="$emit('play', paged[2].displayName)" :style="{ width: size, height: size }">
          <StandardLights></StandardLights>
          <GameNPC :camLock="true" :char="'glassman'" :move="paged[2].displayName"></GameNPC>
        </MoveGridBlock>
        <MoveGridBlock v-if="perPage === 4" class="relative cursor-pointe inline-block" @click="$emit('play', paged[3].displayName)" :style="{ width: size, height: size }">
          <StandardLights></StandardLights>
          <GameNPC :camLock="true" :char="'glassman'" :move="paged[3].displayName"></GameNPC>
        </MoveGridBlock>

        <div class="text-center py-6">
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="pageAt > 1 && pageAt--">Back</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="pageAt++">Next</a>
        </div>
        <div class="p-1">
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="showBox = !showBox">Hide Dance Moves</a>

          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'all'" :style="{ backgroundColor: moveListFilter === 'all' ? 'green' : '' }">All</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'church'" :style="{ backgroundColor: moveListFilter === 'church' ? 'green' : '' }">Church</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'ready'" :style="{ backgroundColor: moveListFilter === 'ready' ? 'green' : '' }">Ready</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'posture'" :style="{ backgroundColor: moveListFilter === 'posture' ? 'green' : '' }">Posture</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'dance'" :style="{ backgroundColor: moveListFilter === 'dance' ? 'green' : '' }">Dance</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'football'" :style="{ backgroundColor: moveListFilter === 'football' ? 'green' : '' }">Football</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'action'" :style="{ backgroundColor: moveListFilter === 'action' ? 'green' : '' }">Action</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'combat'" :style="{ backgroundColor: moveListFilter === 'combat' ? 'green' : '' }">Combat</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'gun'" :style="{ backgroundColor: moveListFilter === 'gun' ? 'green' : '' }">Gun</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="moveListFilter = 'control'" :style="{ backgroundColor: moveListFilter === 'control' ? 'green' : '' }">Control</a>

          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="pageAt++">Next</a>
          <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="pageAt > 1 && pageAt--">Back</a>
        </div>
      </div>
    </div>

    <LoadingGUI></LoadingGUI>

    <!-- <div v-if="!showBox" class="p-1 select-none lg:select-text absolute z-20 top-0 left-0 text-xs lg:text-sm text-white w-56 overflow-y-auto moves-box">
      <div class="p-1">
        <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="showBox = !showBox">Show Dance Moves</a>
      </div>
    </div>
    <div v-if="moves && showBox" class="p-1 select-none lg:select-text absolute z-20 top-0 left-0 text-xs lg:text-sm text-white overflow-y-auto">
      <a :ref="`item-${moveItem._id}`" v-for="moveItem in moves.filter(actionFilter)" :key="moveItem._id + moveItem.displayName" @click="onChooseMove({ move: moveItem })" class="inline-block px-2 mx-1 my-1 border-gray-100 border" :style="{ backgroundColor: lastClickedMove === moveItem ? '#4299e1' : 'rgba(0,0,0,0.3)' }">{{ moveItem.displayName }}</a>
    </div>
    <div v-if="showLoading" class="absolute top-0 left-0 h-full w-full flex justify-center items-center" :class="{ 'bg-transp-black': true }">
      <div class="px-6 py-3 rounded-full bg-white text-black"> {{loadingPercentage.toFixed(2)}}% Loading...</div>
    </div> -->
  </div>
</template>

<script>
import { Moves } from './Moves.js'
import { Actions } from './Actions.js'
import { LoadingManager } from '../../Core/LoadingManager'
import { RenderRootGrid } from '../../Core/RenderRootGrid.js'
import { WaterMatCap } from '../Materials/WaterMatCap.js'
export default {
  mixins: [
    RenderRootGrid
  ],
  data () {
    return {
      matcap: false,
      pageAt: 0,
      perPage: 6,
      size: '100px',
      showBox: true,
      lastClickedMove: false,
      moveListFilter: 'dance',
      moves: new Moves(),
      PI: Math.PI,
      layouts: {},
      showLoading: false,
      loadingPercentage: 0
    }
  },
  watch: {
    moveListFilter () {
      this.pageAt = 0
    }
  },
  computed: {
    paged () {
      return this.moves.filter(this.actionFilter).slice(this.perPage * this.pageAt, this.perPage * this.pageAt + this.perPage)
    }
  },
  methods: {
    actionFilter (item) {
      if (this.moveListFilter === 'all') {
        return true
      } else if (this.moveListFilter) {
        if (this.moveListFilter === item.type) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    async onChooseMove({ move }) {
      this.lastClickedMove = move
      await Actions.loadFBX({ url: move.url })
      this.$emit('play', move.displayName)
    }
  },
  mounted () {
    this.onResize(() => {
      let rect = this.$refs.glarea.getBoundingClientRect()

      let ws = rect.width
      if (window.innerWidth > 767) {
        this.size = ws / 2 + 'px'
        this.perPage = 4
      } else {
        this.size = ws + 'px'
        this.perPage = 3
      }

      // this.perPage = Math.floor(rect.height / (rect.width / 3) * 3)
    })

    this.matcap = new WaterMatCap({
      onLoop: this.onLoop,
      scale: 1
    })

    LoadingManager.hooks.push((v) => {
      if (v > 0) {
        this.showLoading = true
      }
      if (v === 1) {
        this.showLoading = false
      }
      this.loadingPercentage = v * 100
      if (this.loadingPercentage < 0) {
        this.loadingPercentage = 0
      }
    })
  }
}
</script>

<style lang="postcss">
.moves-box{
  height: 170px;
}
@screen lg {
  .moves-box{
    height: calc(100% - 250px);
  }
}
.touch-action-manipulation{
  touch-action: manipulation;
}
.bg-transp-black{
  background-color: rgba(255, 242, 242, 0.3);
}
.bg-transp-white{
  background-color: rgba(255,255,255,0.3);
}
.touch-action-manipulation {
  touch-action: manipulation;
}
.toolbar{
  height: 200px;
}
.glarea{
  height: calc(100% - 200px);
}
@screen lg {
  .toolbar{
    height: 80px;
  }
  .glarea{
    height: calc(100% - 80px);
  }
}
</style>
