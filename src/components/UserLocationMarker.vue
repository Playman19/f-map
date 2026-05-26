<template>
  <div v-if="userLocationStore.position"></div>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { useUserLocation } from '../stores/useUserLocation'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Circle, Fill, Stroke } from 'ol/style'

const props = defineProps({
  map: { type: Object, required: true }
})

const mapStore = useMapStore()
const userLocationStore = useUserLocation()

let vectorLayer = null
let currentFeature = null

const createLayer = () => {
  if (!props.map) return
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 100
  })
  props.map.addLayer(vectorLayer)
}

const updateMarker = () => {
  if (!userLocationStore.position || !vectorLayer) return

  const [lon, lat] = userLocationStore.position

  if (!currentFeature) {
    currentFeature = new Feature({
      geometry: new Point([lon, lat])
    })

    currentFeature.setStyle(new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: '#ff2f0a' }),
        stroke: new Stroke({ color: '#ffffff', width: 4 })
      })
    }))

    vectorLayer.getSource().addFeature(currentFeature)
  } else {
    currentFeature.getGeometry().setCoordinates([lon, lat])
  }
}

// Создаём слой при монтировании
createLayer()

// Следим за позицией
watch(() => userLocationStore.position, updateMarker, { immediate: true })

onUnmounted(() => {
  if (vectorLayer && props.map) {
    props.map.removeLayer(vectorLayer)
  }
})
</script>
<style>
.gg {
    color: #ff2f0a;
}
</style>