<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 lg:py-24 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"/>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"/>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          {{ $t('badge.title') }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ $t('badge.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100"
        >
          <div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <img
              :src="badge.icon"
              :alt="badge.title"
              class="w-12 h-12 object-contain"
            >
          </div>
          <div class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {{ badge.number }}{{ badge.suffix }}
          </div>
          <div class="text-gray-700 font-semibold text-base leading-relaxed">{{ badge.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import local SVG assets
import globeIcon from '~/assets/images/badges/globe.svg'
import cameraIcon from '~/assets/images/badges/camera.svg'
import athletesIcon from '~/assets/images/badges/athletes.svg'
import eventsIcon from '~/assets/images/badges/events.svg'

const { t } = useI18n()

const badges = computed(() => [
  {
    id: 1,
    icon: globeIcon,
    number: '70',
    suffix: '',
    title: t('badge.countries')
  },
  {
    id: 2,
    icon: cameraIcon,
    number: '200',
    suffix: 'M',
    title: t('badge.images')
  },
  {
    id: 3,
    icon: athletesIcon,
    number: '30',
    suffix: 'M',
    title: t('badge.athletes')
  },
  {
    id: 4,
    icon: eventsIcon,
    number: '8',
    suffix: 'K',
    title: t('badge.events')
  }
])
</script>
