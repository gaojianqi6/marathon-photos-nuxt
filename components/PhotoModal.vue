<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="relative max-w-6xl max-h-[90vh] w-full">
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Photo Container -->
          <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="relative">
              <img
                v-if="photo"
                :src="photo.url"
                :alt="`Photo ${photo.id}`"
                class="w-full h-auto max-h-[70vh] object-contain mx-auto"
              />
            </div>

            <!-- Actions -->
            <div class="p-4 border-t border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between gap-4 mb-3">
                <button
                  @click="reportNotMe"
                  class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm border border-red-200 hover:border-red-300"
                >
                  Report this is not me
                </button>
                
                <div class="flex items-center gap-3">
                  <button
                    v-if="hasPrevious"
                    @click="previousPhoto"
                    class="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="Previous photo"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span class="text-sm text-gray-600">
                    {{ currentIndex + 1 }} / {{ totalPhotos }}
                  </span>
                  <button
                    v-if="hasNext"
                    @click="nextPhoto"
                    class="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    aria-label="Next photo"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Add to Cart button -->
              <div v-if="eventPath" class="flex items-center justify-center">
                <button
                  @click="handleAddToCart"
                  :disabled="isPhotoInCart"
                  :class="[
                    'flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium text-sm shadow-md hover:shadow-lg',
                    isPhotoInCart
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{{ isPhotoInCart ? 'Already in Cart' : 'Add to Cart' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Photo {
  id: string
  url: string
  offset: number
  orientation?: string
  score?: number
}

interface Props {
  isOpen: boolean
  photo: Photo | null
  allPhotos: Photo[]
  currentIndex: number
  eventPath?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  next: []
  previous: []
  reportNotMe: [photo: Photo | null]
  addToCart: [photo: Photo | null]
}>()

const cartStore = useCartStore()

// Check if current photo is in cart
const isPhotoInCart = computed(() => {
  if (!props.photo || !props.eventPath) return false
  return cartStore.isPhotoInCart(props.eventPath, props.photo.id)
})

const handleAddToCart = () => {
  if (props.photo && !isPhotoInCart.value) {
    emit('addToCart', props.photo)
  }
}

const hasNext = computed(() => props.currentIndex < props.allPhotos.length - 1)
const hasPrevious = computed(() => props.currentIndex > 0)
const totalPhotos = computed(() => props.allPhotos.length)

const close = () => {
  emit('close')
}

const nextPhoto = () => {
  if (hasNext.value) {
    emit('next')
  }
}

const previousPhoto = () => {
  if (hasPrevious.value) {
    emit('previous')
  }
}

const reportNotMe = () => {
  emit('reportNotMe', props.photo)
}

// Keyboard navigation
let handleKeydown: ((e: KeyboardEvent) => void) | null = null

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'ArrowRight' && hasNext.value) {
        nextPhoto()
      } else if (e.key === 'ArrowLeft' && hasPrevious.value) {
        previousPhoto()
      }
    }
    document.addEventListener('keydown', handleKeydown)
  } else {
    if (handleKeydown) {
      document.removeEventListener('keydown', handleKeydown)
      handleKeydown = null
    }
  }
})

onUnmounted(() => {
  if (handleKeydown) {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>
