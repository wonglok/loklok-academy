<template>
  <div>
    <!-- <O3D :px="0" :pz="10" :py="50">
      <PointLight :decay="2" :distance="0" :color="0xffffff" :helper="isDev && isOff" :intensity="0.4"></PointLight>
    </O3D>

    <O3D :px="0" :pz="-10" :py="18">
      <PointLight :decay="2" :distance="0" :color="0xffffff" :helper="isDev && isOff" :intensity="0.4"></PointLight>
    </O3D>

    <O3D :px="30" :pz="30" :py="10">
      <HemisphereLight :color="0xffffff" :floorColor="0xbababa" :helper="isDev && isOff" :intensity="0.03"></HemisphereLight>
    </O3D>

    <O3D :px="-30" :pz="30" :py="10">
      <HemisphereLight :color="0xffffff" :floorColor="0xbababa" :helper="isDev && isOff" :intensity="0.03"></HemisphereLight>
    </O3D>

    <O3D :px="30" :pz="-30" :py="10">
      <HemisphereLight :color="0xffffff" :floorColor="0xbababa" :helper="isDev && isOff" :intensity="0.03"></HemisphereLight>
    </O3D>

    <O3D :px="-30" :pz="-30" :py="10">
      <HemisphereLight :color="0xffffff" :floorColor="0xbababa" :helper="isDev && isOff" :intensity="0.03"></HemisphereLight>
    </O3D> -->

    <O3D :px="0" :pz="0" :py="1000">
      <DirectionalLight :color="0xffffff" :floorColor="0xffffff" :helper="isDev && isOff" :intensity="0.75"></DirectionalLight>
    </O3D>

    <O3D :px="0" :pz="0" :py="0">
      <AmbinetLight :color="0xffffff" :helper="isDev && isOff" :intensity="0.5"></AmbinetLight>
    </O3D>

    <!-- <O3D :px="0" :pz="0" :py="0">
      <AmbinetLight :color="0xffffff" :helper="isDev && isOff" :intensity="0.2"></AmbinetLight>
    </O3D> -->

  </div>
</template>

<script>
export default {
  mixins: [
    require('../../Core/O3DG2.js').O3DG2
  ]
}
</script>

<style>

</style>