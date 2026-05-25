<script setup>
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';

import { useMapStore } from '../stores/mapStore';

import { useUserLocation } from '../stores/useUserLocation';

import { usePanoramasStore } from '../stores/usePanoramasStore';

import { useSectionPoints } from '../stores/useSectionPoints';

const props = defineProps(['testConnectDataProps', 'testConnectEmitsData'])
const emit = defineEmits(['setProps'])

const ms = useMapStore();
const ul = useUserLocation();
const ps = usePanoramasStore();
const sp = useSectionPoints();

const isPanoramasDataVisible = ref(false);
const isSectionThreadsDataVisible = ref(false);
const isPaymentThreadsDataVisible = ref(true);

function togglePanoramasData() {
    isPanoramasDataVisible.value = !isPanoramasDataVisible.value;
}

function toggleSectionThreadsData() {
    isSectionThreadsDataVisible.value = !isSectionThreadsDataVisible.value;
}

function togglePaymentThreadsData() {
    isPaymentThreadsDataVisible.value = !isPaymentThreadsDataVisible.value;
}

const dispZoom = computed(() => Math.round(Number(ms.zoom)));
const dispCenter = computed(() => ms.center ? `${ms.center[0].toFixed(4)}, ${ms.center[1].toFixed(4)}` : 'N/A');
// const dispCenter = computed(() => ms.center ? `${ms.center[0]}, ${ms.center[1]}` : 'N/A');
const dispUserLocation = computed(() => ul.position ? `${ul.position[0].toFixed(4)}, ${ul.position[1].toFixed(4)}` : 'N/A');
const dispBasemap = computed(() => ms.currentBasemap || 'N/A');

const items1 = ref([
    { key: 'Зум', value: dispZoom || 'N/A' },
    { key: 'Центр', value: dispCenter },
    { key: 'Геопозиция пользователя', value: dispUserLocation },
    { key: 'Выбранная тема', value: dispBasemap }
]);

const dispPanoramaVisibility = computed(() => ms.isLayerVisible('panoramas') ? '✅' : '⛔️');
const dispData = computed(() => ms.getLayerSize('panorama'));
const panoramasCount = computed(() => ps.items.length);
const panoramaParts = computed(() => {
    const parts = ms.getLayerParts('panorama');
    return {
        label: parts?.label ? '✅' : '⛔️',
        likes: parts?.likes ? '✅' : '⛔️'
    }
})

const items2 = computed(() => [
    { key: 'Видимость слоя', value: dispPanoramaVisibility },
    { key: 'Количество панорам', value: panoramasCount || 'N/A' },
    { key: 'Диапазон зума', value: `${dispData.value?.zoomFrom || 'N/A'} - ${dispData.value?.zoomTo || 'N/A'}` || 'N/A' },
    { key: 'Заголовки', value: panoramaParts.value.label },
    { key: 'Лайки', value: panoramaParts.value.likes },
    { key: 'Внутрениий радиус метки', value: dispData.value?.innerRadius || 'N/A' },
    { key: 'Внешний радиус метки', value: dispData.value?.outerRadius || 'N/A' },
    { key: 'Размер иконки', value: dispData.value?.iconSize || 'N/A' },
    { key: 'Масштаб иконки', value: dispData.value?.iconScale || 'N/A' },
    { key: 'Размер текста названия', value: dispData.value?.labelFontSize || 'N/A' },
    { key: 'Смещение текста названия по X', value: dispData.value?.labelOffsetX || 'N/A' },
    { key: 'Смещение текста названия по Y', value: dispData.value?.labelOffsetY || 'N/A' },
    { key: 'Размер текста лайков', value: dispData.value?.likesFontSize || 'N/A' },
    { key: 'Смещение текста лайков по X', value: dispData.value?.likesOffsetX || 'N/A' },
    { key: 'Смещение текста лайков по Y', value: dispData.value?.likesOffsetY || 'N/A' },
    { key: 'Размер иконки лайков', value: dispData.value?.likesIconSize || 'N/A' },
    { key: 'Позиционирование иконки лайков', value: dispData.value?.likesAnchor.join(' | ') || 'N/A' }
]);

const dispTSVisibility = computed(() => ms.isLayerVisible('sectionThreads') ? '✅' : '⛔️');
const dispTSData = computed(() => ms.getLayerSize('sectionThreads'));
const stParts = computed(() => {
    const parts = ms.getLayerParts('sectionThreads');
    return {
        icon: parts?.icon ? '✅' : '⛔️',
    }
})

const items3 = computed(() => [
    { key: 'Видимость слоя', value: dispTSVisibility },
    { key: 'Темы в разделе', value: sp.points.length || 'N/A' },
    { key: 'Диапазон зума', value: `${dispTSData.value?.zoomFrom || 'N/A'} - ${dispTSData.value?.zoomTo || 'N/A'}` || 'N/A' },
    { key: 'Иконки', value: stParts.value.icon },
    { key: 'Внутрениий радиус метки', value: dispTSData.value?.innerRadius || 'N/A' },
    { key: 'Внешний радиус метки', value: dispTSData.value?.outerRadius || 'N/A' },
    { key: 'Масштаб иконки', value: dispTSData.value?.iconScale || 'N/A' },
    { key: 'Размер текста названия', value: dispTSData.value?.tooltipFontSize || 'N/A' },
    { key: 'Размер отступа внутри тултипа', value: dispTSData.value?.tooltipPadding.join(' | ') || 'N/A' }
])



const dispPTVisibility = computed(() => ms.isLayerVisible('paymentThreads') ? '✅' : '⛔️');
const dispPTData = computed(() => ms.getLayerSize('paymentThreads'));
const ptParts = computed(() => {
    const parts = ms.getLayerParts('paymentThreads');
    return {
        icon: parts?.icon ? '✅' : '⛔️',
        label: parts?.label ? '✅' : '⛔️',
        likes: parts?.likes ? '✅' : '⛔️'
    }
})
const items4 = computed(() => [
    { key: 'Видимость слоя', value: dispPTVisibility },
    { key: 'Темы в разделе', value: sp.points.length || 'N/A' },
    { key: 'Диапазон зума', value: `${dispPTData.value?.zoomFrom || 'N/A'} - ${dispPTData.value?.zoomTo || 'N/A'}` || 'N/A' },
    { key: 'Иконки', value: ptParts.value.icon },
    { key: 'Заголовки', value: ptParts.value.label },
    { key: 'Лайки', value: ptParts.value.likes },
    { key: 'Внутрениий радиус метки', value: dispPTData.value?.innerRadius || 'N/A' },
    { key: 'Внешний радиус метки', value: dispPTData.value?.outerRadius || 'N/A' },
    { key: 'Масштаб иконки', value: dispPTData.value?.iconScale || 'N/A' },
    { key: 'Размер текста названия', value: dispPTData.value?.labelFontSize || 'N/A' },
    { key: 'Смещение текста названия по X', value: dispPTData.value?.labelOffsetX || 0 },
    { key: 'Смещение текста названия по Y', value: dispPTData.value?.labelOffsetY || 'N/A' },
    { key: 'Размер иконки лайков', value: dispPTData.value?.likesIconSize || 'N/A' },
    { key: 'Смещение текста лайков по X', value: dispPTData.value?.likesOffsetX || 'N/A' },
    { key: 'Смещение текста лайков по Y', value: dispPTData.value?.likesOffsetY || 'N/A' },
    { key: 'Размер текста лайков', value: dispPTData.value?.likesFontSize || 'N/A' },
    { key: 'Позиционирование иконки лайков', value: dispPTData.value?.likesAnchor.join(' | ') || 'N/A' }
])



// Взаимодействие
function setThreadCoordProps(payload = null) {
  if (!payload) {
    // Выключение
    emit('setProps', { 
      type: 'thread-coord', 
      switch: false 
    })
  } 
  else {
    // Включение с координатами
    emit('setProps', { 
      type: 'thread-coord', 
      switch: true, 
      payload: Array.isArray(payload) ? payload : [37.618423, 55.751244] // fallback
    })
  }
}

function setLocationSelectMode(payload = false) {
  emit('setProps', {
    type: 'location-select-mode',
    switch: payload
  })
}

</script>
<template>
    <div class="data-container hide-scrollbar">
        <div class="data-section">Данные карты</div>
        <div class="data-item" v-for="(item, index) in items1" :key="index">
            <div class="data-item-key">
                {{ item.key }}
            </div>
            <div class="data-item-value">
                {{ item.value }}
            </div>
        </div>
        <div class="data-section">Взаимодействие</div>
        <div class="data-item">
            <div class="data-item-key">Готовность карты</div>
            <div class="data-item-value">{{ testConnectEmitsData.mapReady ? '✅' : '⛔️' }}</div>
        </div>
        <div class="data-item">
            <div class="data-item-key">Префикс раздела</div>
            <div class="data-item-value">{{ sp.slug || 'N/A' }}</div>
        </div>
        <div class="data-item">
            <div class="data-item-key">
                Тема на карте
            </div>
            <div class="i-container">
                <button 
                  class="i-btn" 
                  @click="setThreadCoordProps(testConnectDataProps.threadCoord ? null : [33.7355, 53.2210])"
                >
                    <span v-if="testConnectDataProps.threadCoord">✅</span>
                    <span v-else>⛔️</span>
                </button>
                <input v-if="testConnectDataProps.threadCoord" class="i-text" type="text" v-model="testConnectDataProps.threadCoord[0]">
                <input v-if="testConnectDataProps.threadCoord" class="i-text" type="text"  v-model="testConnectDataProps.threadCoord[1]">
            </div>
        </div>
        <div class="data-item">
            <div class="data-item-key">
                Режим выбора локации
            </div>
            <div class="data-item-value">
                <button class="i-btn" @click="setLocationSelectMode(!testConnectDataProps.locationSelectMode)">
                    <span v-if="testConnectDataProps.locationSelectMode">✅</span>
                    <span v-else>⛔️</span>
                </button>
            </div>
        </div>
        <div class="data-item">
            <div class="data-item-key">
                Выбранная локация
            </div>
            <div class="data-item-value">
                {{ testConnectEmitsData.locationSelected || 'N/A' }}
            </div>
        </div>
        <div class="data-item">
            <div class="data-item-value">
                {{ testConnectEmitsData.geoDataSelected || 'N/A' }}
            </div>

        </div>
        <div class="data-section" @click="togglePanoramasData">
            <span>Данные панорам</span>
            <Icon v-if="!isPanoramasDataVisible" icon="raphael:arrowdown" class="data-section-icon" />
            <Icon v-else icon="raphael:arrowup" class="data-section-icon" />
        </div>
        <div v-if="isPanoramasDataVisible" class="data-item" v-for="(item, index) in items2" :key="index">
            <div class="data-item-key">
                {{ item.key }}
            </div>
            <div class="data-item-value">
                {{ item.value }}
            </div>
        </div>
        <div  class="data-section" @click="toggleSectionThreadsData">
            <span>Данные тем в разделе</span>
            <Icon v-if="!isSectionThreadsDataVisible" icon="raphael:arrowdown" class="data-section-icon" />
            <Icon v-else icon="raphael:arrowup" class="data-section-icon" />
        </div>
        <div v-if="isSectionThreadsDataVisible" class="data-item" v-for="(item, index) in items3" :key="index">
            <div class="data-item-key">
                {{ item.key }}
            </div>
            <div class="data-item-value">
                {{ item.value }}
            </div>
        </div>
        <div  class="data-section" @click="togglePaymentThreadsData">
            <span>Данные платных тем</span>
            <Icon v-if="!isPaymentThreadsDataVisible" icon="raphael:arrowdown" class="data-section-icon" />
            <Icon v-else icon="raphael:arrowup" class="data-section-icon" />
        </div>
        <div v-if="isPaymentThreadsDataVisible" class="data-item" v-for="(item, index) in items4" :key="index">
            <div class="data-item-key">
                {{ item.key }}
            </div>
            <div class="data-item-value">
                {{ item.value }}
            </div>
        </div>
    </div>
</template>
<style>
.i-text {
    border: 1px solid grey;
    background-color: transparent;
    color: white;
    width: 86px;
}
.i-container {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-right: 4px;
}
.i-btn {
    border: 1px solid grey;
    background-color: transparent;
    color: white;
    cursor: pointer;
}
    .data-container {
        display: flex;
        flex-direction: column;
        width: 420px;
        overflow-y: auto;
    }
    .data-item, .data-section {
        display: flex;
        justify-content: space-between;
    }
    .data-section {
        background-color: #272c30;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        font-weight: 500;
        color: white;
        position: relative;
        cursor: pointer;
    }
    .data-section-icon {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 4px;
        top: calc(50% - 12px);
        color: #919191;
    }
    .data-item {
        background-color: #31373D;
        position: relative;
    }
    .data-item-key, .data-item-value {
        padding: 6px;
        color: #D3D3D3;
    }
    .data-item::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        width: 420px;
        background-color: white;
        transform: scaleY(0.5);
    }
    .hide-scrollbar {
      /* Для Chrome, Safari и Opera */
      scrollbar-width: none;          /* Firefox */
      -ms-overflow-style: none;       /* Internet Explorer и Edge */
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;                  /* Chrome, Safari и Opera */
    }
</style>