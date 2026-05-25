<template>
  <div></div>
</template>

<script setup>
import { useNominatimStore } from '../stores/nominatim'
import { onMounted, onUnmounted, watch } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style'
import Overlay from 'ol/Overlay'

const nominatim = useNominatimStore()

const props = defineProps({
  map: { type: Object, required: true },
  active: { type: Boolean, default: false },           // режим активен
  selectedCoord: { type: Array, default: null }        // [lon, lat]
})

const emit = defineEmits(['location-selected'])

let vectorLayer = null
let previewFeature = null      // временная точка при наведении
let selectedFeature = null     // выбранная точка
let tooltipOverlay = null

const createLayer = () => {
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 100
  })
  props.map.addLayer(vectorLayer)
}

const createTooltip = () => {
  const el = document.createElement('div')
  el.style.cssText = `
    background: rgba(15, 23, 42, 0.96);
    color: #bae6fd;
    padding: 6px 11px;
    border-radius: 6px;
    font-size: 13px;
    font-family: monospace;
    box-shadow: 0 6px 16px rgba(0,0,0,0.6);
    pointer-events: none;
    white-space: nowrap;
    user-select: none;
    border: 1px solid rgba(186, 230, 253, 0.2);
  `

  tooltipOverlay = new Overlay({
    element: el,
    positioning: 'top-center',     // ← главное изменение
    offset: [0, -72]               // отступ вверх от маркера
  })

  props.map.addOverlay(tooltipOverlay)
}
const createSelectedFeature = (coord) => {
  if (!coord) return null

  const feature = new Feature({
    geometry: new Point(coord),
    data: { type: 'selectedLocation' }
  })

  feature.setStyle(new Style({
    image: new Icon({
      src: `${ICONS_BASE_URL}/icons/location.svg`,
      scale: 0.7,
      anchor: [0.5, 1],           // низ иконки = координата
    })
  }))

  return feature
}

// ==================== События ====================
const handlePointerMove = (evt) => {
  if (!props.active) return

  // Показываем preview-кружок
  if (!previewFeature) {
    previewFeature = new Feature({
      geometry: new Point(evt.coordinate)
    })
    previewFeature.setStyle(new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: 'transparent' }),
        stroke: new Stroke({ color: '#ef4444', width: 2.5 })
      })
    }))
    vectorLayer.getSource().addFeature(previewFeature)
  } else {
    previewFeature.getGeometry().setCoordinates(evt.coordinate)
  }
}

const handleClick = (evt) => {
  if (!props.active) return

  // Удаляем старую выбранную точку
  if (selectedFeature) {
    vectorLayer.getSource().removeFeature(selectedFeature)
  }

  // Создаём новую выбранную точку
  selectedFeature = createSelectedFeature(evt.coordinate)
  if (selectedFeature) {
    vectorLayer.getSource().addFeature(selectedFeature)
  }

  // Обновляем тултип — **над** маркером
  if (tooltipOverlay) {
    const [lon, lat] = evt.coordinate
    nominatim.getGeoData(lon, lat)
    tooltipOverlay.getElement().innerHTML = `
      ${lon.toFixed(6)}, ${lat.toFixed(6)}
    `
    tooltipOverlay.setPosition(evt.coordinate)
  }

  emit('location-selected', evt.coordinate)
}

onMounted(() => {
  createLayer()
  createTooltip()

  // Следим за выбранной координатой извне
  watch(() => props.selectedCoord, (coord) => {
    if (selectedFeature) {
      vectorLayer.getSource().removeFeature(selectedFeature)
    }
    if (coord) {
      selectedFeature = createSelectedFeature(coord)
      vectorLayer.getSource().addFeature(selectedFeature)

      tooltipOverlay.getElement().innerHTML = `
        ${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}
      `
      tooltipOverlay.setPosition(coord)
    }
  }, { deep: true })

  props.map.on('pointermove', handlePointerMove)
  props.map.on('click', handleClick)
})

onUnmounted(() => {
  if (props.map) {
    props.map.un('pointermove', handlePointerMove)
    props.map.un('click', handleClick)
    if (vectorLayer) props.map.removeLayer(vectorLayer)
    if (tooltipOverlay) props.map.removeOverlay(tooltipOverlay)
  }
})
</script>