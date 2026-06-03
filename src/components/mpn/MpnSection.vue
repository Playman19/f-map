<script setup>
  import { onMounted, computed } from 'vue'
  import { useSectionPoints } from '../../stores/useSectionPoints'

  const props = defineProps({
    slug: { type: String, required: true }
  })

  const emit = defineEmits(['flyTo'])

  const sp = useSectionPoints()

  onMounted(() => {
    sp.setSlug(props.slug)
  })

  const slugThreads = computed(() => {
    return sp.points
  })

  const emitFlyTo = (thread) => {
    emit('flyTo', thread)
  }

</script>
<template>
  <div class="mpn-pt-cont">
    <ul v-if="slugThreads.length > 0" class="mpn-pt-list">
      <li v-for="thread in slugThreads" :key="thread.id" @click="emitFlyTo(thread)">
        <span>{{ thread.title }}</span>
      </li>
    </ul>
    <div v-else>
      <span class="no-threads">
        На карте пока нет тем из этого раздела
      </span>
    </div>
  </div>
</template>