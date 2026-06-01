<template>
  <div class="search-container">
    <div class="search-wrapper" :class="{ 'search-open': isOpen }">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Поиск..."
        :class="{ 'input-visible': isOpen }"
      />
      <button class="search-button" @click="toggleSearch">
        <Icon icon="mdi:magnify" :width="16" :height="16" v-if="!ss.changedLocation" />
        <Icon icon="mdi:close" :width="16" :height="16" v-else />
      </button>
    </div>
  </div>
  <div class="suggestions-list-container" v-if="ss.items.length > 0 && isOpen && !ss.changedLocation">
    <ul class="suggestions-list">
      <li v-for="suggestion in ss.items" :key="suggestion.id" class="suggestion-item" @click="ss.setChangedLocation(suggestion)">
        <span class="light-sug">{{ suggestion.city }}, </span> <span class="dark-sug">{{ suggestion.country }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useSuggestionsStore } from '../stores/useSuggestionsStore'

const ss = useSuggestionsStore()

const isOpen = ref(false)
const searchQuery = ref('')

let debounceTimeout = null

const toggleSearch = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
}

watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout)
  if (newVal.length >= 3) {
    debounceTimeout = setTimeout(() => {
      ss.getSuggestions(newVal)
    }, 800)
  }
  else {
    ss.clearSuggestions()
  }
})
onMounted(() => {
  ss.clearSuggestions()
})
</script>

<style scoped>

</style>
