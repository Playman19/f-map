<template>
  <Teleport to="body">
    <div v-if="visible" class="panorama-overlay">
      <div class="panorama-header">
        <div class="ph-left">
          <button @click="close" class="close-btn">
            <Icon icon="formkit:arrowleft" width="32" />
          </button>
          <h3>{{ title }}</h3>
        </div>
        <div class="p-right-block">
          <div class="p-coords-block" @click="copyToClipboard(`${coords[1]}, ${coords[0]}`)">
            <span>{{ coords[0] }}, {{ coords[1] }}</span>
            <Icon v-if="!copyStatus" icon="tabler:copy-filled" width="16" />
            <Icon v-else icon="line-md:check-all" width="16" />
          </div>
          <div class="ph-likes-section">
            <Icon icon="boxicons:like-filled" width="18" />
            <span>
              {{ likesCount }}
            </span>
          </div>
          <button class="p-share-btn">
            <Icon icon="material-symbols:share" width="24" />
          </button>
        </div>
      </div>
      <div ref="panoramaContainer" class="panorama-container"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'
import * as THREE from 'three'

// ==================== Настройки ====================
const DEFAULT_ZOOM = 30
const MIN_ZOOM = 20
const MAX_ZOOM = 200
// ==================================================

const props = defineProps({
  visible: Boolean,
  imageUrl: String,
  title: String,
  likesCount: Number,
  coords: Array
})

const emit = defineEmits(['close'])
const panoramaContainer = ref(null)

let scene = null
let camera = null
let renderer = null
let sphere = null
let animationId = null
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }

// Полная очистка ресурсов Three.js
const disposePanorama = () => {
  // Останавливаем анимацию
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  
  // Очищаем рендерер
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    renderer = null
  }
  
  // Очищаем сферу
  if (sphere) {
    if (sphere.geometry) {
      sphere.geometry.dispose()
    }
    if (sphere.material) {
      if (sphere.material.map) {
        sphere.material.map.dispose()
      }
      sphere.material.dispose()
    }
    sphere = null
  }
  
  // Очищаем сцену
  if (scene) {
    while(scene.children.length) {
      const child = scene.children[0]
      if(child.isMesh) {
        if(child.geometry) child.geometry.dispose()
        if(child.material) {
          if(child.material.map) child.material.map.dispose()
          child.material.dispose()
        }
      }
      scene.remove(child)
    }
    scene = null
  }
  
  camera = null
  
  // Очищаем контейнер
  if (panoramaContainer.value) {
    panoramaContainer.value.innerHTML = ''
  }
}

const initPanorama = async () => {
  if (!panoramaContainer.value || !props.imageUrl) return
  
  // Очищаем предыдущую сцену перед созданием новой
  disposePanorama()
  await nextTick()

  // Создаем сцену
  scene = new THREE.Scene()
  
  // Создаем камеру
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(0, 0, DEFAULT_ZOOM)
  
  // Создаем рендерер
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1)
  
  // Добавляем в DOM
  panoramaContainer.value.innerHTML = ''
  panoramaContainer.value.appendChild(renderer.domElement)
  
  // Создаем геометрию и текстуру
  const geometry = new THREE.SphereGeometry(500, 64, 64)
  const texture = new THREE.TextureLoader().load(props.imageUrl)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  
  sphere = new THREE.Mesh(geometry, material)
  sphere.scale.x = -1
  scene.add(sphere)
  
  // Запускаем анимацию
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()
}

// Drag (вращение)
const onMouseDown = (e) => {
  isDragging = true
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

const onMouseMove = (e) => {
  if (!isDragging || !sphere) return
  
  const deltaX = e.clientX - previousMousePosition.x
  const deltaY = e.clientY - previousMousePosition.y
  
  sphere.rotation.y -= deltaX * 0.005
  sphere.rotation.x -= deltaY * 0.005
  
  previousMousePosition = { x: e.clientX, y: e.clientY }
}

const onMouseUp = () => {
  isDragging = false
}

// Zoom колёсиком
const onWheel = (e) => {
  if (!camera) return
  
  const factor = e.deltaY > 0 ? 1.08 : 0.93
  camera.position.z *= factor
  
  // Ограничения
  camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z))
}

const close = () => {
  emit('close')
}

// Обработка изменения размера окна
const onWindowResize = () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Следим за видимостью
watch(() => props.visible, async (val) => {
  if (val) {
    await nextTick()
    initPanorama()
  } else {
    disposePanorama()
  }
})

// Жизненный цикл
onMounted(() => {
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  disposePanorama()
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('resize', onWindowResize)
})


// === фУНКЦИИ НЕ СВЯЗАННЫЕ С ПАНОРАМОЙ ===

const copyStatus = ref(false)

const copyToClipboard = async (text) => {
  if (!text) {
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = true
    setTimeout(() => {
      copyStatus.value = false
    }, 1000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<style scoped>
.panorama-overlay > * {
  font-family: Arial, Helvetica, sans-serif;
}
.panorama-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 99999;
  display: flex;
  flex-direction: column;
}

.panorama-header {
  padding: 12px 20px;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0 12px;
}

.panorama-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.ph-left {
  display: flex;
}
.ph-left > h3 {
  color: white;
  font-weight: 500;
}
.ph-likes-section {
  color: white;
  display: flex;
  align-items: center;
  margin-left: 24px;
}
.ph-likes-section > span {
  margin-left: 4px;
}
.p-share-btn {
  border: none;
  outline: none;
  background-color: transparent;
  color: white;
  cursor: pointer;
  margin-left: 12px;
}
.p-right-block {
  display: flex;
  align-items: center;
}
.p-coords-block {
  color: white;
  font-family: monospace;
  border: 1px solid grey;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  cursor: pointer;
}
.p-coords-block > span {
  margin-right: 4px;
  transition: all .2s ease-in-out;
}
.p-coords-block > span:hover {
  color: rgb(1, 187, 1);
}
</style>