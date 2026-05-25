<template>
  <div class="map-style-control ml4 relative">
    <button 
      class="map-btn"
      @click="toggleDropdown"
    >
      <Icon icon="lucide:layers" width="24" height="24" color="#F9F9F9" />
    </button>

    <div v-if="isOpen" ref="ddRef" class="style-dropdown" >
      <div 
        v-for="(name, key) in mapStore.basemaps" 
        :key="key"
        class="style-option flex aic"
        :class="{ active: mapStore.currentBasemap === key }"
        @click="changeStyle(key)"
      >
        <Icon :icon="iconsNames[key]" width="16" height="16" color="#F9F9F9" />
        <span class="ml4">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useMapStore } from '../stores/mapStore'
import { onClickOutside } from '@vueuse/core'

const mapStore = useMapStore()
const isOpen = ref(false)

const ddRef = ref(null)
onClickOutside(ddRef, () => {
  isOpen.value = false
})

const iconsNames = {
  'osm': 'material-symbols:light-mode',
  'openstreetmap-dark': 'material-symbols:dark-mode-rounded',
  'streets-v4-dark': 'gravity-ui:geo-fill',
  'carto-light': 'simple-icons:atlasos',
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const changeStyle = (key) => {
  mapStore.setBasemap(key)
  isOpen.value = false
}

// Закрываем при клике вне
const closeOnClickOutside = (e) => {
  if (!e.target.closest('.map-style-control')) {
    isOpen.value = false
  }
}
</script>