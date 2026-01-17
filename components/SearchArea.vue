<template>
  <div class="w-full max-w-3xl mx-auto">
    <div class="relative">
      <!-- Custom Search Input with better styling -->
      <div class="relative">
        <!-- Search Icon -->
        <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg
            v-if="!isLoading"
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-blue-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        <!-- Input Field -->
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('search.placeholder')"
          class="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder:text-gray-400 bg-white"
          @keydown.enter="performSearch"
        />
      </div>

      <!-- Search Results - Absolutely positioned below input -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="searchResults.length > 0"
          class="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
        >
        <ul class="divide-y divide-gray-100">
          <li
            v-for="event in searchResults"
            :key="event.eventid"
            class="p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group"
            @click="selectEvent(event)"
          >
            <div class="flex flex-col space-y-1">
              <span class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
                {{ formatEventName(event) }}
              </span>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.country }}
                </span>
                <span>•</span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Transition>

      <!-- Error Message -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="errorMessage"
          class="absolute left-0 right-0 top-full mt-2 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md z-50"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-800 text-sm font-medium">{{ errorMessage }}</p>
          </div>
        </div>
      </Transition>

      <!-- No Results -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="hasSearched && searchResults.length === 0 && !isLoading && !errorMessage"
          class="absolute left-0 right-0 top-full mt-2 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl text-center z-50"
        >
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-gray-600 text-sm font-medium">{{ $t('search.noResults') }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
interface EventResult {
  country: string
  live: number
  display_name: {
    en: string
  }
  event: string
  eventid: string
  date: string
}

interface SearchResponse {
  status: string
  result?: EventResult[]
  reason?: string
}

const searchQuery = ref('')
const searchResults = ref<EventResult[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const hasSearched = ref(false)

const emit = defineEmits<{
  eventSelected: [event: EventResult]
}>()

let searchTimeout: NodeJS.Timeout | null = null

// Watch for search query changes and debounce
watch(searchQuery, async (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!newValue.trim()) {
    searchResults.value = []
    errorMessage.value = ''
    hasSearched.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    await performSearch()
  }, 300) // Debounce search
})

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  hasSearched.value = true

  try {
    const response = await $fetch<SearchResponse>(
      '/api/search',
      {
        params: {
          q: searchQuery.value
        }
      }
    )

    if (response.status === 'ok') {
      searchResults.value = response.result || []
      if (response.result && response.result.length === 0) {
        errorMessage.value = ''
      }
    } else if (response.status === 'error') {
      errorMessage.value = response.reason || 'An error occurred while searching'
      searchResults.value = []
    }
  } catch (error) {
    console.error('Search error:', error)
            errorMessage.value = t('search.error')
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const selectEvent = (event: EventResult) => {
  emit('eventSelected', event)
  searchQuery.value = ''
  searchResults.value = []
}

const formatEventName = (event: EventResult): string => {
  // Format: Month Abbreviation Year: display_name.en
  const date = new Date(event.date)
  const monthAbbr = date.toLocaleDateString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${monthAbbr} ${year}: ${event.display_name.en}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
