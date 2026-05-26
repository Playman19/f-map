<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useSectionPoints } from '../stores/useSectionPoints'
import { useMapStore } from '../stores/mapStore'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle, Fill, Stroke, Text } from 'ol/style'
import Overlay from 'ol/Overlay'

const props = defineProps({
  map: { type: Object, required: true }
})

const sectionStore = useSectionPoints()
const mapStore = useMapStore()

let vectorLayer = null
let tooltipOverlay = null

const createLayer = () => {
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 90
  })
  props.map.addLayer(vectorLayer)
}

const createTooltip = () => {
  const el = document.createElement('div')
  tooltipOverlay = new Overlay({
    element: el,
    positioning: 'bottom-center',
    offset: [0, -18]
  })
  props.map.addOverlay(tooltipOverlay)
}

const createFeature = (point) => {
  const size = mapStore.getLayerSize('sectionThreads')
  const parts = mapStore.getLayerParts('sectionThreads')

  const feature = new Feature({
    geometry: new Point(point.coords),
    data: point,
    layerType: 'sectionThreads'        // ← уникальный маркер слоя
  })

  const styles = []

  styles.push(new Style({
    image: new Circle({
      radius: size.outerRadius,
      fill: new Fill({ color: '#ffffff' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    })
  }))

  styles.push(new Style({
    image: new Circle({
      radius: size.innerRadius,
      fill: new Fill({ color: '#232537' })
    })
  }))

  if(parts.icon) {
    styles.push(new Style({
      image: new Icon({
        src: `${ICONS_BASE_URL}/icons/st.png`,
        scale: size.iconScale,
        anchor: [0.5, 0.5]
      })
    }))
  }

  feature.setStyle(styles)

  return feature
}

const renderPoints = () => {
  if (!vectorLayer) return
  vectorLayer.getSource().clear()

  sectionStore.points.forEach(point => {
    const feature = createFeature(point)
    vectorLayer.getSource().addFeature(feature)
  })
}

let currentTooltipData = null

function handleTooltipClick(event) {
  event.stopPropagation()

  if(currentTooltipData.id) {
    const url = `${THREAD_LINK}/${currentTooltipData.id}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
const handleClick = (evt) => {
  const feature = props.map.forEachFeatureAtPixel(evt.pixel, f => f, {
    hitTolerance: 12
  })

  // Проверяем, что это именно наш слой
  if (feature && feature.get('layerType') === 'sectionThreads') {
    const data = feature.get('data')
    currentTooltipData = data
    const tooltipEl = tooltipOverlay.getElement()
    
    // Применяем стили из конфига
    const size = mapStore.getLayerSize('sectionThreads')
    tooltipEl.style.cssText = `
      background: rgba(0, 0, 0, 0.92);
      color: white;
      padding: ${size.tooltipPadding ? size.tooltipPadding.join('px ') + 'px' : '9px 13px'};
      border-radius: 6px;
      font-size: ${size.tooltipFontSize || 14}px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      white-space: nowrap;
      cursor: pointer;
    `

    tooltipEl.textContent = data.title

    tooltipOverlay.setPosition(evt.coordinate)
    tooltipEl.addEventListener('click', handleTooltipClick )
  } else {
    tooltipOverlay.setPosition(undefined)
  }
}

onMounted(() => {
  if (!props.map) return
  createLayer()
  createTooltip()
  renderPoints()

  // Cursor pointer
  props.map.on('pointermove', (evt) => {
    const hit = props.map.hasFeatureAtPixel(evt.pixel, { hitTolerance: 12 })
    props.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
  })

  props.map.on('click', handleClick)
})

onUnmounted(() => {
  if (props.map) {
    if (vectorLayer) props.map.removeLayer(vectorLayer)
    if (tooltipOverlay) {
      tooltipOverlay.getElement().removeEventListener('click', handleTooltipClick)
      props.map.removeOverlay(tooltipOverlay)
    }
    if (tooltipOverlay) props.map.removeOverlay(tooltipOverlay)
    props.map.un('click', handleClick)
  }
})

// Перерисовка при изменении зума
watch(() => mapStore.zoom, () => {
  renderPoints()
}, { deep: true })
</script>