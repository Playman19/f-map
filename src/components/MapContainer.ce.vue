<template>
  <div ref="mapRoot" class="map-container">
    <SearchDD v-if="mapStore.isReady"/>
    <MapSelectedSuggestion v-if="mapStore.isReady && ss.changedLocation" :map="map" />
    <MapToolbar v-if="mapStore.isReady" :auth="auth" class="map-toolbar" />
    <ResizeBtns v-if="mapStore.isReady && resizeMode" @resize="resizeMap" />
    <MapPointsNavigation v-if="mapStore.isReady && mpn" />

    <UserLocationMarker v-if="mapStore.isReady" :map="map" />
    <MapPanoramas v-if="mapStore.isReady && mapStore.isLayerVisible('panoramas') && ps.loadingStatus === 'success'" :map="map" />
    <MapSectionThreads v-if="mapStore.isReady && mapStore.isLayerVisible('sectionThreads') && sp.slug && sp.isReq" :map="map" />
    <MapPaymentThreads v-if="mapStore.isReady && mapStore.isLayerVisible('paymentThreads')" :map="map" />
    
    <!-- Новый слой для threadCoord -->
    <MapThreadCoord 
      v-if="mapStore.isReady && threadCoord" 
      :map="map" 
      :thread-coord="threadCoord" 
    />

    <!-- Режим выбора локации -->
    <MapLocationPicker 
      v-if="mapStore.isReady && locationSelectMode" 
      :map="map" 
      :active="locationSelectMode" 
      :selected-coord="selectedLocationCoord" 
      @location-selected="handleLocationSelected"
    />

    <PanoramaViewer
      :id="mapStore.panoramaViewer.id"
      :visible="mapStore.panoramaViewer.visible"
      :image-url="mapStore.panoramaViewer.imageUrl"
      :title="mapStore.panoramaViewer.title"
      :likes-count="mapStore.panoramaViewer.likesCount"
      :coords="mapStore.panoramaViewer.coords"
      :user="mapStore.panoramaViewer.user"
      @close="mapStore.closePanorama"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { useGeographic } from 'ol/proj'
import { ScaleLine } from 'ol/control';

import { useMapStore } from '../stores/mapStore'
import { useUserLocation } from '../stores/useUserLocation'
import { useNominatimStore } from '../stores/nominatim'
import { useSectionPoints } from '../stores/useSectionPoints'
import { usePanoramasStore } from '../stores/usePanoramasStore'
import { useSuggestionsStore } from '../stores/useSuggestionsStore'

import MapToolbar from './MapToolbar.vue'
import UserLocationMarker from './UserLocationMarker.vue'
import MapPanoramas from './MapPanoramas.vue'
import MapSectionThreads from './MapSectionThreads.vue'
import MapPaymentThreads from './MapPaymentThreads.vue'
import MapThreadCoord from './MapThreadCoord.vue'
import MapLocationPicker from './MapLocationPicker.vue'
import PanoramaViewer from './PanoramaViewer.vue'
import SearchDD from './SearchDD.vue'
import MapSelectedSuggestion from './MapSelectedSuggestion.vue'
import ResizeBtns from './ResizeBtns.vue'
import MapPointsNavigation from './MapPointsNavigation.vue'

// ==================== Props & Emits ====================
const props = defineProps({
  threadCoord: {
    type: Array,
    default: null
  },
  locationSelectMode: {
    type: Boolean,
    default: false
  },
  threadsSlug: {
    type: String,
    default: false
  },
  auth: {
    type: Boolean,
    default: false
  },
  flyTo: {
    type: Array,
    default: null
  },
  resizeMode: {
    type: Boolean,
    default: false
  },
  mpn: {
    type: Boolean,
    default: false
  },
  panoramaId: {
    type: String,
    default: null
  }
})



const emit = defineEmits([
  'map-ready',
  'location-selected',
  'geo-data-selected',
  'slug-counted',
  'resize',
  'disable-panorama-props',
])

// ==================== Reactive data ====================
const threadCoord = ref(props.threadCoord)
const locationSelectMode = ref(props.locationSelectMode)
const selectedLocationCoord = ref(null)

const mapStore = useMapStore()
const userLocationStore = useUserLocation()
const nominatim = useNominatimStore()
const sp = useSectionPoints()
const ps = usePanoramasStore()
const ss = useSuggestionsStore()

if(props.threadsSlug) {
  sp.setSlug(props.threadsSlug)
}
if(props.flyTo) {
  setTimeout(() => {
    mapStore.flyTo(props.flyTo[0], props.flyTo[1], 18)
  }, 1200)
}

if(props.panoramaId) {
  setTimeout(() => {
    mapStore.openPanorama({  id: props.panoramaId }, true)
  }, 500)
}

watch(() => mapStore.panoramaStatus, () => {
  if(mapStore.panoramaStatus === false) {
    emit('disable-panorama-props')
  } 
})

function showSlugThreadsFlag(l) {
  emit('slug-counted', l)
}
watch(()  => sp.points, () => {
  if(sp.points.length) {
    showSlugThreadsFlag(sp.points.length)
  }
})

function resetNominatim() {
  nominatim.reset()
}

ps.getPanoramas()

function resizeMap() {
  emit('resize')
}

const mapRoot = ref(null)
let map = null

// ==================== Watch for props ====================
watch(() => props.threadCoord, (newVal) => {
  if(!newVal) return
  threadCoord.value = newVal
})

watch(() => props.locationSelectMode, (newVal) => {
  if(newVal === false) {
    nominatim.reset()
  }
  locationSelectMode.value = newVal
})

watch(() => nominatim.geoData, () => {
  const gd = nominatim.geoData?.display_name
  emit('geo-data-selected', gd)
})

// ==================== Map Initialization ====================
onMounted(() => {
  useGeographic()
  resetNominatim()

  if (!mapRoot.value) return

  // ==================== Base Layers ====================
  const baseLayers = {
  osm: new TileLayer({
    source: new OSM(),
    visible: false,
    properties: { key: 'osm' }
  }),

  'carto-light': new TileLayer({
    source: new XYZ({
      url: 'https://{a-d}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',
      attributions: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19
    }),
    visible: false,
    properties: { key: 'carto-light' }
  }),

  'openstreetmap-dark': new TileLayer({
    source: new XYZ({
      url: 'https://api.maptiler.com/maps/openstreetmap-dark/{z}/{x}/{y}.png?key=j0is9lBnWN8ARaRrBqgX',
      attributions: '© <a href="https://www.maptiler.com/copyright/">MapTiler</a>, © OpenStreetMap contributors',
      maxZoom: 19
    }),
    visible: false,
    properties: { key: 'openstreetmap-dark' }
  }),

  'streets-v4-dark': new TileLayer({
    source: new XYZ({
      url: 'https://api.maptiler.com/maps/streets-v4-dark/{z}/{x}/{y}.png?key=j0is9lBnWN8ARaRrBqgX',
      attributions: '© <a href="https://www.maptiler.com/copyright/">MapTiler</a>, © OpenStreetMap contributors',
      maxZoom: 19
    }),
    visible: false,
    properties: { key: 'streets-v4-dark' }
  })
}

  map = new Map({
    target: mapRoot.value,
    layers: Object.values(baseLayers),
    view: new View({
      center: mapStore.center,
      zoom: mapStore.zoom,
      constrainResolution: true,
    }),
    controls: []
  })

  mapStore.setMapInstance(map)
  mapStore.setMapReady(false)

  // Активация базового слоя
  const activateLayer = () => {
    Object.values(baseLayers).forEach(layer => {
      layer.setVisible(layer.get('key') === mapStore.currentBasemap)
    })
  }
  activateLayer()

  watch(() => mapStore.currentBasemap, activateLayer)

  // События карты
  map.getView().on('change:center', () => mapStore.setCenter(map.getView().getCenter()))
  map.getView().on('change:resolution', () => mapStore.setZoom(map.getView().getZoom()))

  const onPostRender = () => {
    mapStore.setMapReady(true)
    emit('map-ready', true)               // ← эмитируем готовность
    map.un('postrender', onPostRender)
  }
  map.on('postrender', onPostRender)

  const resizeObserver = new ResizeObserver(() => map?.updateSize())
  resizeObserver.observe(mapRoot.value)
  mapRoot.value._resizeObserver = resizeObserver
})

onUnmounted(() => {
  if (map) map.dispose()
  if (mapRoot.value?._resizeObserver) mapRoot.value._resizeObserver.disconnect()
})

// ==================== Handlers ====================
const handleLocationSelected = (coord) => {
  const fixedCoord = [Number(coord[0].toFixed(4)), Number(coord[1].toFixed(4))]
  selectedLocationCoord.value = fixedCoord
  emit('location-selected', fixedCoord)
}

const handleDataSelected = (data) => {
  emit('geo-data-selected', data)
}

// ==================== Expose ====================
defineExpose({
  getMap: () => map,
  updateSize: () => map?.updateSize(),
  refresh: () => mapStore.refreshMapContainer?.()
})
</script>

<style>
@import url('../assets/layout.css');
@import url('../assets/btns.css');
@import url('../assets/dropdowns.css');
@import url('../assets/flex.css');
@import url('../assets/default.css');
@import url('../assets/searchDD.css');
@import url('../assets/mpn.css');

</style>