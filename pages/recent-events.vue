<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 lg:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 text-center">Recent Events</h1>
        <p class="text-xl lg:text-2xl text-center text-blue-100 max-w-3xl mx-auto leading-relaxed pb-4">
          Marathon Photos Live is the world's leading mass participation event sports photography company operating since 1999, now in 70 countries
        </p>
      </div>
    </section>

    <!-- Events Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <svg class="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p class="text-gray-600 text-lg">Loading recent events...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="text-center py-20">
        <div class="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg max-w-2xl mx-auto">
          <p class="text-red-800 font-medium">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Events Grouped by Date -->
      <div v-else-if="groupedEvents.length > 0" class="space-y-16 mb-16 lg:mb-24">
        <div v-for="group in groupedEvents" :key="group.date" class="space-y-6 pt-8 first:pt-0">
          <!-- Date Header -->
          <div class="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">
              {{ formatDateHeader(group.date) }}
            </h2>
            <span class="text-gray-500 font-medium">
              {{ group.events.length }} {{ group.events.length === 1 ? 'event' : 'events' }}
            </span>
          </div>

          <!-- Events Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6 max-w-7xl mx-auto">
            <NuxtLink
              v-for="event in group.events"
              :key="event.eventid"
              :to="`/event/${encodeURIComponent(event.event)}`"
              class="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <!-- Event Image -->
              <div class="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  :src="getEventImage(event.event)"
                  :alt="getEventName(event)"
                  class="w-full h-full object-contain p-3"
                  @error="handleImageError"
                >
              </div>

              <!-- Event Details -->
              <div class="p-4 pb-0 h-[72px] flex items-start flex-shrink-0">
                <h3 class="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {{ getEventName(event) }}
                </h3>
              </div>

              <!-- Bottom Line -->
              <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between h-[44px] flex-shrink-0 mt-auto">
                <!-- Country Flag -->
                <div class="flex items-center gap-1.5 text-gray-600">
                  <span class="text-base" :title="getCountryName(event.country)">
                    {{ getCountryFlag(event.country) }}
                  </span>
                  <span class="text-xs font-medium">{{ event.country }}</span>
                </div>
                
                <!-- Live Status (only show if live) -->
                <div v-if="event.live" class="flex items-center gap-1.5 flex-shrink-0">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
                  <span class="text-[10px] font-semibold text-gray-600 uppercase">Live</span>
                </div>
                <div v-else class="w-0"/>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- No Events State -->
      <div v-else class="text-center py-20">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-600 text-lg">No recent events found</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Event {
  country: string
  live: number
  display_name: Record<string, string>
  event: string
  eventid: string
  date: string
}

interface GroupedEvent {
  date: string
  events: Event[]
}

const isLoading = ref(true)
const errorMessage = ref('')
const events = ref<Event[]>([])

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  'US': '🇺🇸', 'GB': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦', 'DE': '🇩🇪', 'FR': '🇫🇷',
  'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
  'FI': '🇫🇮', 'PT': '🇵🇹', 'GR': '🇬🇷', 'IE': '🇮🇪', 'BE': '🇧🇪', 'CH': '🇨🇭',
  'AT': '🇦🇹', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬',
  'HR': '🇭🇷', 'SK': '🇸🇰', 'SI': '🇸🇮', 'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪',
  'IS': '🇮🇸', 'AE': '🇦🇪', 'SG': '🇸🇬', 'JP': '🇯🇵', 'CN': '🇨🇳', 'KR': '🇰🇷',
  'IN': '🇮🇳', 'NZ': '🇳🇿', 'ZA': '🇿🇦', 'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷',
  'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'TR': '🇹🇷', 'TH': '🇹🇭', 'MY': '🇲🇾',
  'ID': '🇮🇩', 'PH': '🇵🇭', 'VN': '🇻🇳', 'TW': '🇹🇼', 'HK': '🇭🇰'
}

// Country code to name mapping
const countryNames: Record<string, string> = {
  'US': 'United States', 'GB': 'United Kingdom', 'AU': 'Australia', 'CA': 'Canada',
  'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
  'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'PT': 'Portugal',
  'GR': 'Greece', 'IE': 'Ireland', 'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria',
  'AE': 'United Arab Emirates'
}

// Fetch events
onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch<{
      status: string
      result?: Event[]
      reason?: string
    }>('/api/recent-events')

    if (response.status === 'ok' && response.result) {
      events.value = response.result
    } else {
      errorMessage.value = response.reason || 'Failed to load recent events'
    }
  } catch (error: any) {
    console.error('Error fetching recent events:', error)
    errorMessage.value = error.data?.reason || error.message || 'Failed to load recent events. Please try again.'
  } finally {
    isLoading.value = false
  }
})

// Group events by date and sort by date (newest first)
const groupedEvents = computed(() => {
  const groups: Record<string, Event[]> = {}

  events.value.forEach((event) => {
    const date = event.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
  })

  // Convert to array, sort by date (descending - newest first)
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a)) // Sort dates descending
    .map((date) => ({
      date,
      events: groups[date]
    }))
})

// Get event name - prefer 'en', otherwise use first available language
const getEventName = (event: Event): string => {
  if (event.display_name?.en) {
    return event.display_name.en
  }
  
  // Find first available language
  const languages = Object.keys(event.display_name || {})
  if (languages.length > 0) {
    return event.display_name[languages[0]]
  }
  
  return 'Event'
}

// Get event image URL
const getEventImage = (eventPath: string): string => {
  return `https://d2ewvgihbopi1g.cloudfront.net/photos/${eventPath}/logo.gif`
}

// Handle image error - fallback to placeholder
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23e5e7eb" width="400" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EEvent Logo%3C/text%3E%3C/svg%3E'
}

// Get country flag emoji
const getCountryFlag = (countryCode: string): string => {
  return countryFlags[countryCode] || '🌍'
}

// Get country name
const getCountryName = (countryCode: string): string => {
  return countryNames[countryCode] || countryCode
}

// Format date header (e.g., "January 17, 2026")
const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
