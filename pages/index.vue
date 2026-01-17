<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Search Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      <div class="text-center mb-12">
        <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {{ $t('hero.title') }}
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{{ $t('hero.highlight') }}</span>
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ $t('hero.subtitle') }}
        </p>
      </div>
      <SearchArea @event-selected="handleEventSelected" />
    </section>

    <!-- Search Results (if any) - appears above badge -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="selectedEvent" class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-8">
        <div class="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 lg:p-10 max-w-3xl mx-auto">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1">
              <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {{ formatEventName(selectedEvent) }}
              </h2>
              <div class="flex items-center gap-3 text-gray-600">
                <span class="flex items-center gap-1.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ selectedEvent.country }}
                </span>
                <span>•</span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(selectedEvent.date) }}
                </span>
              </div>
            </div>
          </div>
          <NuxtLink
            :to="`/event/${encodeURIComponent(selectedEvent.event)}`"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            {{ $t('event.viewEvent') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- Badge Section -->
    <BadgeSection />
  </div>
</template>

<script setup lang="ts">
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

const selectedEvent = ref<EventResult | null>(null)

const handleEventSelected = (event: EventResult) => {
  selectedEvent.value = event
  // Scroll to the selected event section
  nextTick(() => {
    const element = document.querySelector('.container.mx-auto.px-4.py-8')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const formatEventName = (event: EventResult): string => {
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
