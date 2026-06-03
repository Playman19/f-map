<script setup>
import { Icon } from '@iconify/vue';
import { usePanoramasStore } from '../../stores/usePanoramasStore';
import { useMapStore } from '../../stores/mapStore';

const ps = usePanoramasStore();
const mapStore = useMapStore();

const emit = defineEmits(['fly-to'])

const flyTo = (data) => {
  emit('fly-to', data)
}

const openPanorama = (item) => {
  mapStore.openPanorama(item)
  flyTo(item)
}

</script>
<template>
  <div class="mpn-panoramas-cont">
    <div v-if="ps.items.length > 0" class="mpn-panoramas-list">
      <div v-for="p in ps.items" class="mpn-panoramas-item">
        <div class="mpn-panoramas-item-thumb" @click="openPanorama(p)">
          <img :src="p.images.thumb.url" :alt="p.title" width="48" height="48">
        </div>
        <div class="map-panoramas-item-data">
          <span @click="flyTo(p)">{{ p.title }}</span>
          <div class="flex aic">
            <Icon icon="solar:like-bold" width="12" height="12" color="#F9F9F9" />
            <span class="fs10">{{ p.likes_count }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="no-threads">
        На карте пока нет панорам
      </span>
    </div>
  </div>
</template>