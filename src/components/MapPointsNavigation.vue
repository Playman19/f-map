<script setup>
  import { ref, computed } from 'vue'
  import { Icon } from '@iconify/vue';
  import { onClickOutside } from '@vueuse/core'

  import { useMPN } from '../stores/useMPN'
  import { useMapStore } from '../stores/mapStore'

  import MpnPanoramas from './mpn/MpnPanoramas.vue'
  import MpnTrends from './mpn/MpnTrends.vue'
  import MpnSection from './mpn/MpnSection.vue'

  const mpn = useMPN()
  const mapStore = useMapStore()
  
  // Состояние активной вкладки (по умолчанию null - ничего не выбрано)
  const activeTab = ref(null)
  const activeTypeData = ref(null)
  const mpnItemsWrapper = ref(null)
  const mpnPopover = ref(null)

  onClickOutside(mpnPopover, () => {
    activeTab.value = null
  })
  
  // Вычисляем ширину и позицию контейнера с кнопками
  const popoverStyle = computed(() => {
    if (!mpnItemsWrapper.value) return {}
    
    const rect = mpnItemsWrapper.value.getBoundingClientRect()
    const containerRect = mpnItemsWrapper.value.parentElement?.getBoundingClientRect()
    
    if (!containerRect) return {}
    
    return {
      left: (rect.left - containerRect.left) + 'px',
      width: rect.width + 'px'
    }
  })
  
  // Обработчик клика по вкладке
  const setActiveTab = (id) => {
    if (activeTab.value === id) {
      // Если кликнули по той же вкладке - закрываем поповер
      activeTab.value = null
    } else {
      // Иначе открываем новую вкладку
      activeTab.value = id
      activeTypeData.value = mpn.items.find(item => item.id === id)
    }
  }

  function flyTo(data) {
    mapStore.flyTo(data.coords[0], data.coords[1], 15)
  }
</script>

<template>
  <div class="mpn-container" :class="{ 'mpn-container-active': activeTab !==  null}">
    <div class="mpn-items-wrapper hide-scrollbar" ref="mpnItemsWrapper" >
      <div class="mpn-items hide-scrollbar">
        <button 
          class="mpn-item " 
          :class="{ 'mpn-item-active': activeTab === item.id }"
          v-for="item in mpn.items" 
          :key="item.id"
          @click="setActiveTab(item.id)"
        >
          <Icon :icon="item.icon" width="12" height="12" />
          <span>{{ item.title }}</span>
        </button>
      </div>
    </div>
    
    <!-- POPOVER - показываем только если есть активная вкладка -->
    <div 
      v-if="activeTab !== null" 
      class="mpn-popover"
      :style="popoverStyle"
      ref="mpnPopover"
    >
      <div class="mpn-popover-content">
        <div v-if="activeTypeData !== null">
          <MpnTrends v-if="activeTypeData.id === 1" @fly-to="flyTo" />
          <MpnPanoramas v-else-if="activeTypeData.id === 2" @fly-to="flyTo" />
          <MpnSection v-else-if="activeTypeData.id !== 2 && activeTypeData.id !== 1" :slug="activeTypeData.slug" @fly-to="flyTo" />
        </div>
      </div>
    </div>
  </div>
</template>
