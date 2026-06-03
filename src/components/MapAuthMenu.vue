<script setup>
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue';

const isOpen = ref(false)
const authDDRef = ref(null)

onClickOutside(authDDRef, () => {
  isOpen.value = false
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function gotoAddPanorama() {
  window.open(CREATE_PANORAMA_URL, '_blank', 'noopener,noreferrer')
}

</script>
<template>
  <div>
    <button class="map-btn map-menu-btn" @click="toggleDropdown">
      <Icon icon="qlementine-icons:menu-dots-16" width="16" height="16" color="#F9F9F9" />
    </button>

    <div v-if="isOpen" ref="authDDRef" class="style-dropdown" >
      <div class="style-option flex aic" @click="gotoAddPanorama">
        <Icon icon="fa6-solid:panorama" width="12" height="12" color="#F9F9F9" />
        <span class="ml4 fs10">Добавить панораму</span>
      </div>
    </div>
  </div>
</template>