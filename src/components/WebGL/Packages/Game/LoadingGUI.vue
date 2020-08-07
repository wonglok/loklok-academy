<template>
  <div v-if="showLoading" class="absolute top-0 left-0 h-full w-full flex justify-center items-center" :class="{ 'bg-transp-black': true }">
    <div class="px-4 py-2 rounded-full bg-white text-black text-xs"> {{loadingPercentage.toFixed(2)}}% Loading...</div>
  </div>
</template>

<script>
import { LoadingManager } from '../../Core/LoadingManager'
export default {
  data () {
    return {
      showLoading: false,
      loadingPercentage: 0
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

<style>
.bg-transp-black{
  background-color: rgba(0, 0, 0, 0.555);
}
</style>