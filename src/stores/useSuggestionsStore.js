import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSuggestionsStore = defineStore('suggestions', () => {
    const loading = ref('empty')
    const items = ref([])
    const changedLocation = ref(false)

    const getSuggestions = async (query) => {
        loading.value = 'loading'
        try {
            const response = await axios.get(`${API_URL}/suggestions/cities?query=${query}`)
            items.value = response.data.data
            console.log(items.value)
            loading.value = 'success'
        }
        catch (e) {
            console.log(e)
            loading.value = 'empty'
        }
    }

    const clearSuggestions = () => {
        loading.value = 'empty'
        items.value = []
        changedLocation.value = false
    }

    function setChangedLocation(d) {
        changedLocation.value = d
    }

    return { loading, items, getSuggestions, clearSuggestions, changedLocation, setChangedLocation }
})