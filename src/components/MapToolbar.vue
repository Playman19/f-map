<template>
  <div class="map-toolbar flex aic">
    <button 
      class="map-btn"
      @click="locateMe"
      :disabled="userLocationStore.isLoading"
    >
      <Icon icon="ant-design:aim-outlined" width="24" height="24" color="#FB5E3D" />
    </button>
    <MapSetStyle />
    <div v-if="nominatim.loading === 'success'" class="map-alert ml4">
      {{ nominatim.geoData?.display_name }}
    </div>
  </div>
</template>

<script setup>
import { useNominatimStore } from '../stores/nominatim'
import { Icon } from '@iconify/vue'
import { useMapStore } from '../stores/mapStore'
import { useUserLocation } from '../stores/useUserLocation'
import MapSetStyle from './MapSetStyle.vue'

const mapStore = useMapStore()
const userLocationStore = useUserLocation()
const nominatim = useNominatimStore()

const locateMe = async () => {
  try {
    const coords = await userLocationStore.getCurrentPosition()
    mapStore.flyTo(coords[0], coords[1], 15)
  } catch (e) {
    alert('Не удалось определить местоположение: ' + e.message)
  }
}
</script>
