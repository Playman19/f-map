<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useMapStore } from '../stores/mapStore'
import { useSuggestionsStore } from '../stores/useSuggestionsStore'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import Overlay from 'ol/Overlay'

const props = defineProps({
  map: { type: Object, required: true },
})

const ss = useSuggestionsStore()

const cData = computed(() => ss.changedLocation)

const crd = computed(() => {
  if (!cData.value) return null
  return [Number(cData.value.geo_lon), Number(cData.value.geo_lat)]
})

const mapStore = useMapStore()

let vectorLayer = null
let selectedFeature = null
let tooltipOverlay = null

const createLayer = () => {
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 95
  })
  props.map.addLayer(vectorLayer)
}

const createTooltip = () => {
  const el = document.createElement('div')
  el.style.cssText = `
    background: rgba(15, 23, 42, 0.96);
    color: #bae6fd;
    padding: 2px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: ui-monospace, monospace;
    box-shadow: 0 8px 20px rgba(0,0,0,0.55);
    pointer-events: none;
    white-space: nowrap;
    user-select: none;
    border: 1px solid rgba(103, 232, 249, 0.25);
  `

  tooltipOverlay = new Overlay({
    element: el,
    positioning: 'top-left',
    offset: [12, -30]        // над маркером
  })
  props.map.addOverlay(tooltipOverlay)
}

const createFeature = () => {
  if (!crd.value || crd.value.length !== 2) return null

  const feature = new Feature({
    geometry: new Point(crd.value),
    data: { type: 'threadCoord' },
    layerType: 'threadCoord'
  })

  feature.setStyle(new Style({
    image: new Icon({
      src: `${ICONS_BASE_URL}/icons/location2.svg`,
      scale: 2,
      anchor: [0.5, 1],           // низ иконки = точка
    })
  }))

  return feature
}

const updateTooltip = () => {
  if (!tooltipOverlay || !crd.value) return

  tooltipOverlay.getElement().innerHTML = `
    ${cData.value.city}, ${cData.value.country}
  `
  tooltipOverlay.setPosition(crd.value)
}

const renderThread = () => {
  if (!vectorLayer) return
  vectorLayer.getSource().clear()

  const feature = createFeature()
  if (feature) {
    vectorLayer.getSource().addFeature(feature)
    updateTooltip()
    mapStore.flyTo(crd.value[0], crd.value[1], 13)
  }
}

onMounted(() => {
  if (!props.map) return
  if(!crd.value) return
  createLayer()
  createTooltip()
  renderThread()
})

onUnmounted(() => {
  if (props.map) {
    if (vectorLayer) props.map.removeLayer(vectorLayer)
    if (tooltipOverlay) props.map.removeOverlay(tooltipOverlay)
  }
})

// Обновление при изменении координаты
watch(() => crd.value, () => {
  renderThread()
}, { deep: true })
</script>