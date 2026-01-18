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
      <EventSearch ref="eventSearchRef" :event-path="actualEventPath" :initial-bib="initialBibNumber" @photos-found="handlePhotosFound" />
    </section>

    <!-- Search Results -->
    <div v-if="athleteData" class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Congratulations Section (only show if photos found) -->
      <div v-if="totalPhotos > 0" class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
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
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-lg whitespace-nowrap"
            @click="handleBuyAllPhotos"
          >
            Buy All Photos: {{ formatPrice(allPhotosPrice) }}
          </button>
        </div>
      </div>

      <!-- No Photos Found Section -->
      <div v-else class="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-8 mb-8">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            We don't find photos
          </h2>
          <p class="text-xl text-gray-600">
            Sorry, we couldn't find any photos for bib number {{ athleteData.bib }}. Please check the bib number and try again.
          </p>
        </div>
      </div>

      <!-- Tabs (only show if photos found) -->
      <div v-if="totalPhotos > 0" class="flex gap-2 border-b border-gray-200 mb-8">
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
        <button
          v-if="eventData?.event?.related_events?.length"
          :class="[
            'px-6 py-3 font-medium text-sm transition-colors border-b-2',
            activeTab === 'previousYear'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
          @click="activeTab = 'previousYear'"
        >
          Previous Year
        </button>
      </div>

      <!-- Content Area (only show if photos found) -->
      <div v-if="totalPhotos > 0" class="grid grid-cols-1 gap-8" :class="activeTab === 'photos' ? 'lg:grid-cols-4' : 'lg:grid-cols-1'">
        <!-- Photos / Certificates -->
        <div :class="activeTab === 'photos' ? 'lg:col-span-3' : 'lg:col-span-1'">
          <!-- Photos Tab -->
          <div v-if="activeTab === 'photos'">
            <PhotoMasonry
              :photos="allPhotos"
              :event-path="actualEventPath"
              @photo-click="openPhotoModal"
              @add-to-cart="handlePhotoAddToCart"
            />
          </div>

          <!-- Certificates Tab -->
          <div v-if="activeTab === 'certificates'" class="space-y-6 -mx-4 sm:-mx-6 lg:-mx-8">
            <div v-if="certificates.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 sm:px-6 lg:px-8">
              <div
                v-for="cert in certificates"
                :key="cert.product"
                class="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                @click="openCertificateModal(cert)"
              >
                <div class="aspect-[4/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg class="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2 text-base">{{ cert.name || 'Certificate' }}</h3>
                <div class="flex flex-col gap-2">
                  <span class="text-sm text-gray-600">{{ cert.subevent || 'Marathon' }}</span>
                  <button
                    v-if="cert.price === 0"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    @click.stop="downloadCertificate(cert)"
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

          <!-- Previous Year Tab -->
          <div v-if="activeTab === 'previousYear'" class="space-y-6">
            <div v-if="relatedEvents.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div
                v-for="relatedEvent in relatedEvents"
                :key="relatedEvent.id"
                class="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-center"
              >
                <div class="mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {{ relatedEvent.name?.en || `Event ${relatedEvent.id}` }}
                </h3>
                <div v-if="relatedEvent.date" class="text-sm text-gray-500">{{ formatDate(relatedEvent.date) }}</div>
                <div v-else class="text-sm text-gray-500">Previous Year Event</div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-gray-500">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-lg font-medium">No previous year events available</p>
            </div>
          </div>
        </div>

        <!-- Pricing Sidebar (only show on Photos tab) -->
        <div v-if="activeTab === 'photos'" class="lg:col-span-1">
          <PricingOptions
            v-if="athleteData.currency_pricing"
            :pricing="currentPricing"
            :currency="eventData?.event?.currency || 'EUR'"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <PhotoModal
      :is-open="isModalOpen"
      :photo="selectedPhoto"
      :all-photos="allPhotos"
      :current-index="currentPhotoIndex"
      :event-path="actualEventPath"
      @close="closeModal"
      @next="nextPhoto"
      @previous="previousPhoto"
      @report-not-me="handleReportNotMe"
      @add-to-cart="handlePhotoAddToCart"
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
    related_events?: string[]
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

// Extract bib number if the last segment is numeric
const pathSegments = eventPath.split('/').filter(Boolean)
const lastSegment = pathSegments[pathSegments.length - 1]
const isBibNumber = /^\d+$/.test(lastSegment) // Check if last segment is numeric only

let actualEventPath: string
let initialBibNumber: string | null = null

if (isBibNumber) {
  // Last segment is a bib number, extract it
  initialBibNumber = lastSegment
  // Remove the bib number from the path
  pathSegments.pop()
  actualEventPath = pathSegments.join('/')
} else {
  actualEventPath = eventPath
}

const eventSearchRef = ref<InstanceType<typeof EventSearch> | null>(null)
const athleteData = ref<AthleteData | null>(null)
const eventData = ref<EventData | null>(null)
const activeTab = ref<'photos' | 'certificates' | 'previousYear'>('photos')
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

// Get related events (Previous Year events)
// Note: related_events is an array of event IDs, not full event objects
// We'll need to fetch details if needed, or display them as-is
const relatedEvents = computed(() => {
  // For now, we'll show if related_events IDs exist
  // In a real implementation, you'd fetch event details for each ID
  const eventIds = eventData.value?.event?.related_events || []
  
  // Since we only have IDs, we'll create a simple array for display
  // In production, you'd want to fetch full event details
  return eventIds.map((id, index) => ({
    id: id,
    event: id, // Using ID as event path - might need adjustment based on actual API
    name: { en: `Previous Event ${index + 1}` },
    date: '' // Would need to fetch from API
  }))
})

const router = useRouter()

const handlePhotosFound = async (data: any) => {
  if (data.status === 'ok' && data.athlete) {
    const bib = data.athlete.bib
    // Calculate total photos count from response data
    const photos = [
      ...(data.athlete.photos?.identified || []),
      ...(data.athlete.photos?.autocam || []),
      ...(data.athlete.photos?.generic || []),
      ...(data.athlete.photos?.additional || [])
    ]
    const photosCount = photos.length
    
    if (photosCount > 0) {
      // Photos found - set data and update URL with bib number
      athleteData.value = data.athlete
      eventData.value = data
      
      if (bib) {
        const newPath = `/event/${encodeURIComponent(actualEventPath)}/${bib}`
        
        // Only update URL if it's different from current URL
        if (route.path !== newPath) {
          await router.replace(newPath)
        }
      }
    } else {
      // No photos found - clear athlete data and remove bib from URL
      athleteData.value = null
      eventData.value = data // Keep event data if available
      
      // Update URL to remove bib number if present
      const currentPath = route.path
      if (currentPath.match(/\/\d+$/)) {
        // If URL ends with a number (bib), remove it
        const pathWithoutBib = currentPath.replace(/\/\d+$/, '')
        if (pathWithoutBib !== currentPath) {
          await router.replace(pathWithoutBib)
        }
      }
    }
  } else if (data.status === 'error') {
    // Error response - clear athlete data
    athleteData.value = null
  }
}

const handleBuyAllPhotos = () => {
  const allPhotosOption = currentPricing.value.find((item) => item.product === 'dl_eventcd')
  if (allPhotosOption) {
    handleAddToCart(allPhotosOption)
  }
}

const cartStore = useCartStore()

// Get single photo price
const singlePhotoPrice = computed(() => {
  const singlePhotoOption = currentPricing.value.find((item) => item.product === 'dl_20x30')
  return singlePhotoOption?.price || 0
})

// Get currency
const currency = computed(() => eventData.value?.event?.currency || 'EUR')

// Get current bib number from URL or athlete data
const currentBibNumber = computed(() => {
  // First check if bib number is in the URL
  if (initialBibNumber) {
    return initialBibNumber
  }
  // Otherwise check if we have athlete data with bib
  if (athleteData.value?.bib) {
    return athleteData.value.bib
  }
  return null
})

// Handle add to cart from PricingOptions (bundles)
const handleAddToCart = (option: any) => {
  if (!actualEventPath || !option) return
  
  const cartItem = {
    product: option.product,
    name: option.name,
    price: option.price,
    currency: currency.value,
    event: actualEventPath,
    bibNumber: currentBibNumber.value || undefined
  }
  
  cartStore.addItem(cartItem)
}

// Handle add to cart from PhotoMasonry/PhotoModal (single photo)
const handlePhotoAddToCart = (photo: Photo) => {
  if (!actualEventPath || !photo || singlePhotoPrice.value === 0) return
  
  // Check if photo is already in cart
  if (cartStore.isPhotoInCart(actualEventPath, photo.id)) {
    return
  }
  
  const cartItem = {
    product: 'dl_20x30',
    name: 'Single Photo',
    price: singlePhotoPrice.value,
    currency: currency.value,
    event: actualEventPath,
    photoId: photo.id,
    bibNumber: currentBibNumber.value || undefined
  }
  
  // Get All Event Photos option for comparison (to check if we should replace)
  const allEventPhotosOption = currentPricing.value.find((item) => item.product === 'dl_eventcd')
  
  // Add the single photo - the store will check if total >= All Event Photos and replace
  cartStore.addItem(cartItem, allEventPhotosOption)
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
  // Initialize cart store and load from localStorage
  cartStore.loadCart()
  
  // If there's a bib number in the URL, automatically search for photos
  // But skip if we already have data for this bib (to prevent duplicate requests)
  if (initialBibNumber && eventSearchRef.value && athleteData.value?.bib !== initialBibNumber) {
    // Set the bib number in the search component and trigger search
    await nextTick()
    eventSearchRef.value.searchByBibNumber(initialBibNumber)
  }
})
</script>
