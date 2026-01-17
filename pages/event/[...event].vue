<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Event Header -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="eventData" class="text-center">
          <h1 class="text-4xl lg:text-5xl font-bold mb-4">{{ eventData.event?.display_name?.en || 'Event' }}</h1>
          <div class="flex items-center justify-center gap-4 text-lg">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(eventData.event?.date) }}
            </span>
            <span>•</span>
            <span>{{ eventData.event?.country || '' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Area -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EventSearch :event-path="eventPath" @photos-found="handlePhotosFound" />
    </section>

    <!-- Search Results -->
    <div v-if="athleteData" class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Congratulations Section -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Congratulations {{ athleteData.first_name }}!
            </h2>
            <p class="text-xl text-gray-600">
              We've found <span class="font-bold text-blue-600 text-2xl">{{ totalPhotos }}</span> photos of you
            </p>
          </div>
          <button
            @click="handleBuyAllPhotos"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-lg whitespace-nowrap"
          >
            Buy All Photos: {{ formatPrice(allPhotosPrice) }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-gray-200 mb-8">
        <button
          :class="[
            'px-6 py-3 font-medium text-sm transition-colors border-b-2',
            activeTab === 'photos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
          @click="activeTab = 'photos'"
        >
          Photos
        </button>
        <button
          :class="[
            'px-6 py-3 font-medium text-sm transition-colors border-b-2',
            activeTab === 'certificates'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
          @click="activeTab = 'certificates'"
        >
          Certificates
        </button>
      </div>

      <!-- Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Photos / Certificates -->
        <div :class="['lg:col-span-3', activeTab === 'certificates' ? '' : '']">
          <!-- Photos Tab -->
          <div v-if="activeTab === 'photos'">
            <PhotoMasonry
              :photos="allPhotos"
              @photo-click="openPhotoModal"
            />
          </div>

          <!-- Certificates Tab -->
          <div v-if="activeTab === 'certificates'" class="space-y-6">
            <div v-if="certificates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="cert in certificates"
                :key="cert.product"
                class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                @click="openCertificateModal(cert)"
              >
                <div class="aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">{{ cert.name || 'Certificate' }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">{{ cert.subevent || 'Marathon' }}</span>
                  <button
                    v-if="cert.price === 0"
                    @click.stop="downloadCertificate(cert)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Free Download
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-gray-500">
              <p>No certificates available</p>
            </div>
          </div>
        </div>

        <!-- Pricing Sidebar -->
        <div class="lg:col-span-1">
          <PricingOptions
            v-if="activeTab === 'photos' && athleteData.currency_pricing"
            :pricing="currentPricing"
            :currency="eventData?.event?.currency || 'EUR'"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>

      <!-- Previous Year Events -->
      <div v-if="eventData?.event?.frontend_settings?.related_events?.length" class="mt-12 pt-8 border-t border-gray-200">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Previous Years</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NuxtLink
            v-for="relatedEvent in eventData.event.frontend_settings.related_events"
            :key="relatedEvent.id"
            :to="`/event/${encodeURIComponent(relatedEvent.event)}`"
            class="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-center"
          >
            <div class="text-sm font-medium text-gray-900 mb-1">{{ relatedEvent.name?.en || 'Event' }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(relatedEvent.date) }}</div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <PhotoModal
      :is-open="isModalOpen"
      :photo="selectedPhoto"
      :all-photos="allPhotos"
      :current-index="currentPhotoIndex"
      @close="closeModal"
      @next="nextPhoto"
      @previous="previousPhoto"
      @report-not-me="handleReportNotMe"
    />
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

interface Certificate {
  product: string
  name?: string
  price: number
  subevent?: string
  free_downloads?: string[]
}

interface AthleteData {
  bib: string
  first_name: string
  surname: string
  currency_pricing?: Array<{
    currency: string
    items: Array<{
      product: string
      price: number
      subevent?: string
    }>
  }>
  photos: {
    generic: Photo[]
    autocam: Photo[]
    additional: Photo[]
    identified: Photo[]
  }
}

interface EventData {
  event?: {
    date: string
    country: string
    currency: string
    display_name: {
      en: string
    }
    frontend_settings?: {
      related_events?: Array<{
        id: string
        event: string
        date: string
        name: {
          en: string
        }
      }>
    }
  }
  athlete?: AthleteData
}

const route = useRoute()
// For catch-all routes, the param is an array - join it back
const eventParam = route.params.event
let eventPath: string

if (Array.isArray(eventParam)) {
  // Join the array with slashes for catch-all route
  eventPath = eventParam.join('/')
} else {
  eventPath = eventParam as string
}

// Ensure it's decoded
try {
  eventPath = decodeURIComponent(eventPath)
} catch {
  // Already decoded or decode failed, use as is
}

const athleteData = ref<AthleteData | null>(null)
const eventData = ref<EventData | null>(null)
const activeTab = ref<'photos' | 'certificates'>('photos')
const isModalOpen = ref(false)
const selectedPhoto = ref<Photo | null>(null)
const currentPhotoIndex = ref(0)

// Get all photos from athlete data
const allPhotos = computed(() => {
  if (!athleteData.value) return []
  
  const photos: Photo[] = [
    ...athleteData.value.photos.identified.map((p) => ({
      id: p.id,
      url: p.url,
      offset: p.offset,
      orientation: p.orientation,
      score: p.score
    })),
    ...athleteData.value.photos.autocam.map((p) => ({
      id: p.id,
      url: p.url,
      offset: p.offset || 0,
      orientation: p.orientation,
      score: p.score
    })),
    ...athleteData.value.photos.generic.map((p) => ({
      id: p.id,
      url: p.url,
      offset: p.offset || 0,
      orientation: p.orientation,
      score: p.score
    })),
    ...athleteData.value.photos.additional.map((p) => ({
      id: p.id,
      url: p.url,
      offset: p.offset || 0,
      orientation: p.orientation,
      score: p.score
    }))
  ]
  
  return photos
})

// Get total photos count
const totalPhotos = computed(() => allPhotos.value.length)

// Get certificates
const certificates = computed(() => {
  if (!athleteData.value?.currency_pricing) return []
  
  const certs: Certificate[] = []
  athleteData.value.currency_pricing.forEach((currencyGroup) => {
    currencyGroup.items.forEach((item) => {
      if (item.product.includes('cert') || item.product.includes('Cert')) {
        certs.push({
          product: item.product,
          name: item.product,
          price: item.price,
          subevent: item.subevent
        })
      }
    })
  })
  
  return certs
})

// Get current pricing
const currentPricing = computed(() => {
  if (!athleteData.value?.currency_pricing?.[0]) return []
  return athleteData.value.currency_pricing[0].items.filter((item) => item.price > 0)
})

// Get "All Event Photos" price
const allPhotosPrice = computed(() => {
  const allPhotosOption = currentPricing.value.find((item) => item.product === 'dl_eventcd')
  return allPhotosOption?.price || 0
})

const handlePhotosFound = (data: any) => {
  if (data.status === 'ok' && data.athlete) {
    athleteData.value = data.athlete
    eventData.value = data
  }
}

const handleBuyAllPhotos = () => {
  const allPhotosOption = currentPricing.value.find((item) => item.product === 'dl_eventcd')
  if (allPhotosOption) {
    handleAddToCart(allPhotosOption)
  }
}

const handleAddToCart = (option: any) => {
  // TODO: Implement add to cart functionality
  console.log('Add to cart:', option)
  // You can emit this to a cart store or composable
}

const openPhotoModal = (photo: Photo) => {
  const index = allPhotos.value.findIndex((p) => p.id === photo.id)
  if (index !== -1) {
    currentPhotoIndex.value = index
    selectedPhoto.value = allPhotos.value[index]
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedPhoto.value = null
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < allPhotos.value.length - 1) {
    currentPhotoIndex.value++
    selectedPhoto.value = allPhotos.value[currentPhotoIndex.value]
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    selectedPhoto.value = allPhotos.value[currentPhotoIndex.value]
  }
}

const handleReportNotMe = (photo: Photo) => {
  // TODO: Implement report functionality
  console.log('Report not me:', photo)
  closeModal()
}

const openCertificateModal = (cert: Certificate) => {
  // TODO: Implement certificate modal
  console.log('Open certificate:', cert)
}

const downloadCertificate = (cert: Certificate) => {
  // TODO: Implement certificate download
  console.log('Download certificate:', cert)
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number, currency: string = 'EUR'): string => {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  return `${symbol}${price.toFixed(2)}`
}

// Load event data on mount if available
onMounted(async () => {
  // You can optionally fetch event info here if needed
  // For now, it will be loaded when photos are found
})
</script>
