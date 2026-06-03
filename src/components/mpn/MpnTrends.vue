<script setup>
  import { usePaymentThreads } from '../../stores/usePaymentThreads'
  import { Icon } from '@iconify/vue'

  const paymentStore = usePaymentThreads()

  const emit = defineEmits(['fly-to'])

  function emitFlyTo(data) {
    emit('fly-to', data)
  }
</script>
<template>
  <div class="mpn-pt-cont">
    <ul class="mpn-pt-list">
      <li v-for="trend in paymentStore.points" :key="trend.id" @click="emitFlyTo(trend)">
        <span>{{ trend.title }}</span>
      </li>
    </ul>
  </div>
</template>