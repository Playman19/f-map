<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useMapStore } from '../stores/mapStore'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import Overlay from 'ol/Overlay'

const props = defineProps({
  map: { type: Object, required: true },
  threadCoord: { type: Array, default: null } // [lon, lat]
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
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 13.2px;
    font-family: ui-monospace, monospace;
    box-shadow: 0 8px 20px rgba(0,0,0,0.55);
    pointer-events: none;
    white-space: nowrap;
    user-select: none;
    border: 1px solid rgba(103, 232, 249, 0.25);
  `

  tooltipOverlay = new Overlay({
    element: el,
    positioning: 'top-center',
    offset: [0, -72]        // над маркером
  })
  props.map.addOverlay(tooltipOverlay)
}

const createFeature = () => {
  if (!props.threadCoord || props.threadCoord.length !== 2) return null

  const feature = new Feature({
    geometry: new Point(props.threadCoord),
    data: { type: 'threadCoord' },
    layerType: 'threadCoord'
  })

  feature.setStyle(new Style({
    image: new Icon({
      src: `${ICONS_BASE_URL}/icons/location.svg`,
      scale: 0.7,
      anchor: [0.5, 1],           // низ иконки = точка
    })
  }))

  return feature
}

const updateTooltip = () => {
  if (!tooltipOverlay || !props.threadCoord) return

  const [lon, lat] = props.threadCoord
  tooltipOverlay.getElement().innerHTML = `
    ${lon.toFixed(6)}, ${lat.toFixed(6)}
  `
  tooltipOverlay.setPosition(props.threadCoord)
}

const renderThread = () => {
  if (!vectorLayer) return
  vectorLayer.getSource().clear()

  const feature = createFeature()
  if (feature) {
    vectorLayer.getSource().addFeature(feature)
    updateTooltip()
    mapStore.flyTo(props.threadCoord[0], props.threadCoord[1], 15)
  }
}

onMounted(() => {
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
watch(() => props.threadCoord, () => {
  renderThread()
}, { deep: true })
</script>