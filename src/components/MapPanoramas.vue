<template>
  <div></div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { usePanoramasStore } from '../stores/usePanoramasStore'
import { useMapStore } from '../stores/mapStore'

import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Icon, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style'

const props = defineProps({
  map: { type: Object, required: true }
})

const panoramasStore = usePanoramasStore()
const mapStore = useMapStore()

panoramasStore.getPanoramas()

let vectorLayer = null
const thumbCache = new Map()
let renderTimeout = null
let isRendering = false
let currentZoom = null
let lastRenderedZoom = null

// ==================== Layer Creation ====================
const createLayer = () => {
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
    zIndex: 98,
    updateWhileAnimating: false,  // ← меняем на false для плавности
    updateWhileInteracting: false  // ← меняем на false для плавности
  })
  props.map.addLayer(vectorLayer)
}

// ==================== Canvas Thumbnail ====================
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

const createCircularThumb = async (url, size) => {
  const cacheKey = `${url}|${size}`
  if (thumbCache.has(cacheKey)) return thumbCache.get(cacheKey)

  const img = await loadImage(url)
  
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: false })

  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  const scale = Math.max(size / img.width, size / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = (size - dw) / 2
  const dy = (size - dh) / 2

  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()

  const dataUrl = canvas.toDataURL('image/png')
  thumbCache.set(cacheKey, dataUrl)
  return dataUrl
}

// ==================== Feature Creation ====================
const createFeature = async (item, size, parts) => {
  const circularSrc = await createCircularThumb(`${ICONS_BASE_URL}${item.thumb_path}`, size.iconSize)

  const feature = new Feature({
    geometry: new Point(item.coords),
    data: item,
    layerType: 'panoramas'
  })

  const styles = []

  styles.push(new Style({
    image: new CircleStyle({
      radius: size.outerRadius,
      fill: new Fill({ color: '#ffffff' }),
      stroke: new Stroke({ color: '#ffffff', width: 2 })
    })
  }))

  styles.push(new Style({
    image: new CircleStyle({
      radius: size.innerRadius,
      fill: new Fill({ color: '#ffffff' }),
      stroke: new Stroke({ color: '#17a773', width: 4 })
    })
  }))

  styles.push(new Style({
    image: new Icon({
      src: circularSrc,
      imgSize: [size.iconSize, size.iconSize],
      scale: size.iconScale,
      anchor: [0.5, 0.5],
      crossOrigin: 'anonymous'
    })
  }))

  if(parts.label) {
    styles.push(new Style({
      text: new Text({
        text: item.title || '',
        font: `400 ${size.labelFontSize}px Arial, sans-serif`,
        fill: new Fill({ color: '#9ce4a4' }),
        stroke: new Stroke({ color: '#1b3f37', width: 4 }),
        offsetX: size.labelOffsetX,
        offsetY: size.labelOffsetY,
        textAlign: 'left',
        textBaseline: 'middle'
      })
    }))
  }

  if(parts.likes) {
    styles.push(new Style({
      image: new Icon({
        src: `${ICONS_BASE_URL}/icons/like.svg`,
        scale: size.likesIconSize,
        anchor: size.likesAnchor,
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        imgSize: [size.likesIconSize, size.likesIconSize]
      }),
    }))

    styles.push(new Style({
      text: new Text({
        text: `${item.likes_count || 0}`,
        font: `400 ${size.likesFontSize}px Arial, system-ui, sans-serif`,
        fill: new Fill({ color: '#9ce4a4' }),
        stroke: new Stroke({ color: '#1b3f37', width: 3 }),
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

// ==================== Optimized Render with Smooth Update ====================
const updateStylesForZoom = () => {
  if (!vectorLayer) return
  
  const size = mapStore.getLayerSize('panorama')
  const parts = mapStore.getLayerParts('panorama')
  if (!size) return
  
  const source = vectorLayer.getSource()
  const features = source.getFeatures()
  
  // Обновляем стили существующих фич без пересоздания
  features.forEach(async (feature) => {
    const item = feature.get('data')
    const circularSrc = await createCircularThumb(`${ICONS_BASE_URL}${item.thumb_path}`, size.iconSize)
    
    const styles = []
    
    styles.push(new Style({
      image: new CircleStyle({
        radius: size.outerRadius,
        fill: new Fill({ color: '#ffffff' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 })
      })
    }))
    
    styles.push(new Style({
      image: new CircleStyle({
        radius: size.innerRadius,
        fill: new Fill({ color: '#ffffff' }),
        stroke: new Stroke({ color: '#17a773', width: 4 })
      })
    }))
    
    styles.push(new Style({
      image: new Icon({
        src: circularSrc,
        imgSize: [size.iconSize, size.iconSize],
        scale: size.iconScale,
        anchor: [0.5, 0.5],
        crossOrigin: 'anonymous'
      })
    }))
    
    if(parts.label) {
      styles.push(new Style({
        text: new Text({
          text: item.title || '',
          font: `400 ${size.labelFontSize}px Arial, sans-serif`,
          fill: new Fill({ color: '#9ce4a4' }),
          stroke: new Stroke({ color: '#1b3f37', width: 4 }),
          offsetX: size.labelOffsetX,
          offsetY: size.labelOffsetY,
          textAlign: 'left',
          textBaseline: 'middle'
        })
      }))
    }
    
    if(parts.likes) {
      styles.push(new Style({
        image: new Icon({
          src: `${ICONS_BASE_URL}/icons/like.svg`,
          scale: size.likesIconSize,
          anchor: size.likesAnchor,
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          imgSize: [size.likesIconSize, size.likesIconSize]
        }),
      }))
      
      styles.push(new Style({
        text: new Text({
          text: `${item.likes_count || 0}`,
          font: `400 ${size.likesFontSize}px Arial, system-ui, sans-serif`,
          fill: new Fill({ color: '#9ce4a4' }),
          stroke: new Stroke({ color: '#1b3f37', width: 3 }),
          offsetX: size.likesOffsetX,
          offsetY: size.likesOffsetY,
          textAlign: 'left',
          textBaseline: 'middle'
        })
      }))
    }
    
    feature.setStyle(styles)
  })
}

const renderPanoramas = async (forceUpdate = false) => {
  if (renderTimeout) clearTimeout(renderTimeout)
  if (isRendering) return

  renderTimeout = setTimeout(async () => {
    if (!vectorLayer || !panoramasStore.items.length) return
    
    // Если зум изменился незначительно и не forceUpdate - обновляем только стили
    const currentZoomLevel = Math.floor(mapStore.zoom)
    if (!forceUpdate && lastRenderedZoom === currentZoomLevel && vectorLayer.getSource().getFeatures().length > 0) {
      updateStylesForZoom()
      return
    }
    
    isRendering = true
    
    try {
      const source = vectorLayer.getSource()
      
      // Сохраняем текущие координаты вьюпорта для плавности
      const viewCenter = props.map.getView().getCenter()
      const viewZoom = props.map.getView().getZoom()
      
      source.clear()
      
      const size = mapStore.getLayerSize('panorama')
      const parts = mapStore.getLayerParts('panorama')
      
      // Создаем все фичи
      const features = await Promise.all(
        panoramasStore.items.map(item => createFeature(item, size, parts))
      )
      
      // Добавляем все фичи сразу
      source.addFeatures(features.filter(Boolean))
      
      // Восстанавливаем позицию карты без рывка
      props.map.getView().setCenter(viewCenter)
      props.map.getView().setZoom(viewZoom)
      
      lastRenderedZoom = currentZoomLevel
      
    } catch (error) {
      console.error('Error rendering panoramas:', error)
    } finally {
      isRendering = false
    }
  }, 60)
}

// ==================== Clear Cache ====================
const clearThumbCache = () => {
  thumbCache.clear()
}

// ==================== Event Handlers ====================
const handleClick = (evt) => {
  const feature = props.map.forEachFeatureAtPixel(evt.pixel, f => f, {
    hitTolerance: 15
  })

  if (feature && feature.get('layerType') === 'panoramas') {
    mapStore.openPanorama(feature.get('data'))
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  createLayer()
  renderPanoramas()

  // Оптимизированный pointermove с throttle
  let pointerMoveThrottle = false
  props.map.on('pointermove', (evt) => {
    if (pointerMoveThrottle) return
    pointerMoveThrottle = true
    
    requestAnimationFrame(() => {
      const hit = props.map.hasFeatureAtPixel(evt.pixel, { hitTolerance: 15 })
      props.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
      pointerMoveThrottle = false
    })
  })

  props.map.on('click', handleClick)
})

onUnmounted(() => {
  if (renderTimeout) clearTimeout(renderTimeout)
  if (props.map && vectorLayer) {
    props.map.removeLayer(vectorLayer)
  }
  clearThumbCache()
})

// Оптимизированный вотчер зума
let zoomTimer = null
let lastZoomValue = null

watch(() => mapStore.zoom, (newVal, oldVal) => {
  if (zoomTimer) clearTimeout(zoomTimer)
  
  const newZoomInt = Math.floor(newVal)
  const oldZoomInt = Math.floor(oldVal)
  
  // Перерисовываем только при смене целой части зума
  if (newZoomInt !== oldZoomInt) {
    zoomTimer = setTimeout(() => {
      renderPanoramas()
    }, 150)
  } else {
    // Просто обновляем стили без мигания
    zoomTimer = setTimeout(() => {
      updateStylesForZoom()
    }, 50)
  }
  
  lastZoomValue = newVal
}, { deep: true })
</script>