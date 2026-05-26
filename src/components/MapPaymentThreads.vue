<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { usePaymentThreads } from '../stores/usePaymentThreads'
import { useMapStore } from '../stores/mapStore'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle, Fill, Stroke, Text } from 'ol/style'

const props = defineProps({
  map: { type: Object, required: true }
})

const paymentStore = usePaymentThreads()
const mapStore = useMapStore()

let vectorLayer = null

const createLayer = () => {
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 99
  })
  props.map.addLayer(vectorLayer)
}

const createFeature = (point) => {
  const size = mapStore.getLayerSize('paymentThreads')
  const parts = mapStore.getLayerParts('paymentThreads')

  const feature = new Feature({
    geometry: new Point(point.coords),
    data: point,
    layerType: 'paymentThreads'
  })

  const styles = []

  // 1. Внешняя белая обводка
  styles.push(new Style({
    image: new Circle({
      radius: size.outerRadius,
      fill: new Fill({ color: '#ffffff' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    })
  }))

  // 2. Тонкое синее кольцо (по середине белого)
  styles.push(new Style({
    image: new Circle({
      radius: size.outerRadius - 1.5,        // чуть внутри белого
      fill: new Fill({ color: 'transparent' }),
      stroke: new Stroke({ 
        color: '#4cc9f0',                    // приятный синий
        width: 2 
      })
    })
  }))

  // 3. Тёмный внутренний круг
  styles.push(new Style({
    image: new Circle({
      radius: size.innerRadius,
      fill: new Fill({ color: '#191500' })
    })
  }))

  if (parts.icon) {
    styles.push(new Style({
      image: new Icon({
        src: `${ICONS_BASE_URL}/icons/st.png`,
        scale: size.iconScale,
        anchor: [0.5, 0.5]
      })
    }))
  }

  if (parts.label) {
    styles.push(new Style({
      text: new Text({
        text: point.title || '',
        font: `100 ${size.labelFontSize}px Arial, system-ui, sans-serif`,
        fill: new Fill({ color: '#ffeabb' }),
        stroke: new Stroke({ color: '#1b3f37', width: 5 }),
        offsetX: size.labelOffsetX,
        offsetY: size.labelOffsetY,
        textAlign: 'center',
        textBaseline: 'top'
      })
    }))
  }

  if (parts.likes) {
    styles.push(new Style({
      image: new Icon({
        src: `${ICONS_BASE_URL}/icons/like.svg`,
        scale: size.likesIconSize,
        anchor: size.likesAnchor,
        imgSize: [size.likesIconSize, size.likesIconSize]
      }),
      offsetX: size.likesOffsetX,
      offsetY: size.likesOffsetY
    }))

    styles.push(new Style({
      text: new Text({
        text: `${point.likes_count || 0}`,
        font: `200 ${size.likesFontSize}px Arial, system-ui, sans-serif`,
        fill: new Fill({ color: '#ffeabb' }),
        stroke: new Stroke({ color: '#1b3f37', width: 4 }),
        offsetX: size.likesOffsetX,
        offsetY: size.likesOffsetY,
        textAlign: 'left',
        textBaseline: 'middle'
      })
    }))
  }

  feature.setStyle(styles)
  feature.set('cursor', 'pointer')
  return feature
}

const renderPoints = () => {
  if (!vectorLayer) return
  vectorLayer.getSource().clear()

  paymentStore.points.forEach(point => {
    const feature = createFeature(point)
    vectorLayer.getSource().addFeature(feature)
  })
}

const handleClick = (evt) => {
  const feature = props.map.forEachFeatureAtPixel(evt.pixel, f => f, {
    hitTolerance: 12
  })

  if (feature && feature.get('layerType') === 'paymentThreads') {
    console.log('💰 Payment Thread кликнут:', feature.get('data'))
    if(feature.get('data').id) {
      const id = feature.get('data').id
      const url = `${THREAD_LINK}/${id}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }
}

onMounted(() => {
  if (!props.map) return
  createLayer()
  renderPoints()

  props.map.on('pointermove', (evt) => {
    const hit = props.map.hasFeatureAtPixel(evt.pixel, { hitTolerance: 12 })
    props.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
  })

  props.map.on('click', handleClick)
})

onUnmounted(() => {
  if (props.map && vectorLayer) {
    props.map.removeLayer(vectorLayer)
  }
})

watch(() => mapStore.zoom, () => {
  renderPoints()
}, { deep: true })
</script>