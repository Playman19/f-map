import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

import { mapConfig } from '../config/mapConfig'

const STORAGE_KEY = 'map-view'

export const useMapStore = defineStore('map', () => {
  const center = ref([37.618423, 55.751244])
  const zoom = ref(10)
  const isReady = ref(false)
  const mapInstance = ref(null)
  const currentBasemap = ref('osm')

  // ====================== Load from localStorage ======================
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.center) center.value = data.center
        if (data.zoom) zoom.value = data.zoom
        if (data.currentBasemap) currentBasemap.value = data.currentBasemap
      }
    } catch (e) {
      console.warn('Не удалось загрузить настройки карты из localStorage', e)
    }
  }

  // ====================== Save to localStorage ======================
  const saveToStorage = () => {
    try {
      const data = {
        center: center.value,
        zoom: zoom.value,
        currentBasemap: currentBasemap.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Не удалось сохранить настройки карты', e)
    }
  }

  // ====================== Actions ======================
  const setCenter = (newCenter) => {
    center.value = newCenter
  }

  const setZoom = (newZoom) => {
    zoom.value = newZoom
  }

  const setMapReady = (ready) => {
    isReady.value = ready
  }

  const setMapInstance = (map) => {
    mapInstance.value = map
  }

  const flyTo = (lon, lat, newZoom = null, duration = 1200) => {
    if (!mapInstance.value) return
    mapInstance.value.getView().animate({
      center: [lon, lat],
      zoom: newZoom !== null ? newZoom : zoom.value,
      duration: duration
    })
  }

  const updateSize = () => {
    mapInstance.value?.updateSize()
  }

// ===== СМЕНА ТЕМЫ =====

const basemaps = {
  'osm': 'Стандартная',
  'openstreetmap-dark': 'Тёмная',
  'streets-v4-dark': 'Синяя',
  'carto-light': 'Атлас',
}

// Функция смены темы
const setBasemap = (key) => {
  if (basemaps[key]) {
    currentBasemap.value = key
  }
}

  // ====================== Watch & Auto Save ======================
  watch([center, zoom, currentBasemap], () => {
    saveToStorage()
  }, { deep: true })

  // Загружаем при инициализации стора
  loadFromStorage()


// ==== Раскладка по слоям из конфига ====

// Получить конфигурацию размеров для слоя в зависимости от текущего зума
const getLayerSize = (layerName, zoomValue = zoom.value) => {
  const layerConfig = mapConfig.sizes[layerName]
  
  if (!layerConfig?.ranges?.length) {
    console.warn(`[mapConfig] Нет диапазонов для слоя: ${layerName}`)
    return null
  }

  // Округляем зум вниз — так стабильнее на стыках
  const roundedZoom = Math.floor(zoomValue)

  // Ищем подходящий диапазон
  const range = layerConfig.ranges.find(r => 
    roundedZoom >= r.zoomFrom && roundedZoom <= r.zoomTo
  )

  if (range) {
    return range
  }
}

// Получить, какие части слоя нужно отрисовывать на текущем зуме
const getLayerParts = (layerName, zoomValue = zoom.value) => {
  const partsConfig = mapConfig.parts?.[layerName]
  if (!partsConfig?.length) {
    // Если ничего не указано — показываем всё
    return { icon: true, label: true, likes: true }
  }

  const roundedZoom = Math.floor(zoomValue)

  const config = partsConfig.find(p => 
    roundedZoom >= p.zoomFrom && roundedZoom <= p.zoomTo
  )

  return config
}

// Проверка видимости слоя по зуму
const isLayerVisible = (layerName, zoomValue = zoom.value) => {
  const layer = mapConfig.layers[layerName]
  if (!layer) return false
  return layer.visible && zoomValue >= layer.zoomFrom && zoomValue <= layer.zoomTo
}


// ==================== Panorama Viewer ====================
const panoramaViewer = ref({
  visible: false,
  imageUrl: '',
  title: '',
  likesCount: 0,
  coords: [],
  user: null
})

const panoramaStatus = ref(false)

async function getPanoramaDataById(id) {
  try {
    const response = await axios.get(`${API_URL}/panoramas/${id}`)
    panoramaStatus.value = true
    return response.data.data
  } catch (error) {
    panoramaStatus.value = true
    alert('Этой панорамы не существует')
    setTimeout(() => {
      panoramaStatus.value = false
    }, 500)
    console.error(error)
  }
}

const openPanorama = async (item, param=false) => {
  const panoramaData = await getPanoramaDataById(item.id)
  if(!panoramaData) return
  if(param) {
    flyTo(panoramaData?.coords[0], panoramaData?.coords[1], 16)
    setTimeout(() => {    
      panoramaViewer.value = {
        visible: true,
        id: item.id,
        imageUrl: panoramaData?.images.panorama.url,
        title: panoramaData?.title || 'Панорама',
        likesCount: panoramaData?.likes_count,
        coords: panoramaData?.coords,
        user: panoramaData?.author || null
      }
    }, 1600)
  }
  else {
    panoramaViewer.value = {
      visible: true,
      id: item.id,
      imageUrl: panoramaData?.images.panorama.url,
      title: panoramaData?.title || 'Панорама',
      likesCount: panoramaData?.likes_count,
      coords: panoramaData?.coords,
      user: panoramaData?.author || null
    }
  }
}

const closePanorama = () => {
  panoramaViewer.value.visible = false
  panoramaStatus.value = false
}

  return {
    center,
    zoom,
    isReady,
    mapInstance,
    basemaps,
    currentBasemap,

    
    setCenter,
    setZoom,
    setMapReady,
    setMapInstance,
    flyTo,
    updateSize,
    setBasemap,

    getLayerSize,
    getLayerParts,
    isLayerVisible,

    panoramaViewer,
    panoramaStatus,
    openPanorama,
    closePanorama,
  }
})