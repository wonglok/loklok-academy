<template>
  <div class="">
    <div v-if="!showBox" class="p-1 select-none lg:select-text absolute z-20 top-0 left-0 text-xs lg:text-sm text-white w-56 overflow-y-auto moves-box">
      <div class="p-1">
        <a class="inline-block bg-transp-black px-2 mr-1 mb-1 border-gray-100 border" @click="showBox = !showBox">Show Dance Moves</a>
      </div>
    </div>
    <div v-if="moves && showBox" class="p-1 select-none lg:select-text absolute z-20 top-0 left-0 text-xs lg:text-sm text-white w-56 overflow-y-auto moves-box">
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
      </div>

      <!-- <a :ref="`item-${moveItem._id}`" v-for="moveItem in game.moves.filter(actionFilter)" :key="moveItem._id + moveItem.displayName" @click="gui('play-move', { move: moveItem }); lastClickedMove = moveItem" class="block px-2 mx-1 my-1 border-gray-100 border" :style="{ backgroundColor: lastClickedMove === moveItem ? '#4299e1' : 'rgba(0,0,0,0.3)' }">{{ moveItem.displayName }}</a> -->
      <a :ref="`item-${moveItem._id}`" v-for="moveItem in moves.filter(actionFilter)" :key="moveItem._id + moveItem.displayName" @click="onChooseMove({ move: moveItem })" class="block px-2 mx-1 my-1 border-gray-100 border" :style="{ backgroundColor: lastClickedMove === moveItem ? '#4299e1' : 'rgba(0,0,0,0.3)' }">{{ moveItem.displayName }}</a>
    </div>
    <div v-if="showLoading" class="absolute top-0 left-0 h-full w-full flex justify-center items-center" :class="{ 'bg-transp-black': true }">
      <div class="px-6 py-3 rounded-full bg-white text-black"> {{loadingPercentage.toFixed(2)}}% Loading...</div>
    </div>
  </div>
</template>

<script>
import { Moves } from './Moves.js'
import { Actions } from './Actions.js'
import { LoadingManager } from '../../Core/LoadingManager'
export default {
  data () {
    return {
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
  background-color: rgba(0,0,0,0.3);
}
.bg-transp-white{
  background-color: rgba(255,255,255,0.3);
}
.touch-action-manipulation {
  touch-action: manipulation;
}
</style>
