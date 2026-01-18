<template>
  <div class="w-full">
    <!-- All photos in masonry layout -->
    <div class="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
      <div
        v-for="photo in sortedPhotos"
        :key="photo.id"
        class="mb-4 break-inside-avoid group cursor-pointer"
        @click="openPhotoModal(photo)"
      >
        <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gray-100">
          <img
            :src="photo.url"
            :alt="`Photo ${photo.id}`"
            class="w-full h-auto object-cover rounded-lg"
            loading="lazy"
            @error="handleImageError"
          />
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
            <svg class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- Photo ID badge -->
          <div v-if="photo.id" class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            ID: {{ photo.id }}
          </div>
          <!-- Add to Cart icon (bottom right) -->
          <button
            v-if="eventPath"
            @click.stop="handleAddToCart(photo)"
            :disabled="isPhotoInCart(photo)"
            :class="[
              'absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-700 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed',
              isPhotoInCart(photo) && 'bg-gray-400'
            ]"
            :title="isPhotoInCart(photo) ? 'Already in cart' : 'Add to cart'"
            aria-label="Add to cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="photos.length === 0" class="text-center py-12 text-gray-500">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-lg font-medium">No photos found</p>
    </div>
  </div>
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
  photos: Photo[]
  eventPath?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  photoClick: [photo: Photo]
  addToCart: [photo: Photo]
}>()

const cartStore = useCartStore()

// Check if photo is in cart
const isPhotoInCart = (photo: Photo) => {
  if (!props.eventPath) return false
  return cartStore.isPhotoInCart(props.eventPath, photo.id)
}

// Sort photos by offset, then by score for better display
const sortedPhotos = computed(() => {
  return [...props.photos].sort((a, b) => {
    // First sort by offset
    const offsetDiff = (a.offset || 0) - (b.offset || 0)
    if (offsetDiff !== 0) return offsetDiff
    
    // Then sort by score (higher score first) if available
    if (a.score && b.score) {
      return b.score - a.score
    }
    
    return 0
  })
})

const openPhotoModal = (photo: Photo) => {
  emit('photoClick', photo)
}

const handleAddToCart = (photo: Photo) => {
  if (!isPhotoInCart(photo)) {
    emit('addToCart', photo)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
/* Ensure proper masonry layout */
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
