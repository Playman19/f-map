<script setup>
import { Icon } from '@iconify/vue'

const emit = defineEmits(['resize'])

function openGlobalMap() {
    window.open(GLOBALMAP_URL, '_blank', 'noopener,noreferrer')
}
</script>
<template>
    <div class="map-resize-menu">
        <button class="map-btn" @click="openGlobalMap">
            <Icon icon="material-symbols:map-outline" color="#F9F9F9" width="12" />
        </button>
        <button class="map-btn ml4" @click="emit('resize')">
            <Icon icon="material-symbols:fullscreen" color="#F9F9F9" width="12" />
        </button>
    </div>
</template>