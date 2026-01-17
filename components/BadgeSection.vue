<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 lg:py-24 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Get your event <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LIVE</span> with us!
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Marathon Photos Live is world leading in event sports photography.
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
            />
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
const badges = [
  {
    id: 1,
    icon: 'https://marathonphotos.live/img/globe.4d188807.svg',
    number: '70',
    suffix: '',
    title: 'Operating in 70 Countries'
  },
  {
    id: 2,
    icon: 'https://marathonphotos.live/img/camera.c6816ed2.svg',
    number: '200',
    suffix: 'M',
    title: 'Over 200 Million Images'
  },
  {
    id: 3,
    icon: 'https://marathonphotos.live/img/Athletes_2.dce95e88.svg',
    number: '30',
    suffix: 'M',
    title: 'Over 30 Million Athletes'
  },
  {
    id: 4,
    icon: 'https://marathonphotos.live/img/Events.a01b4893.svg',
    number: '8',
    suffix: 'K',
    title: 'Over 8 Thousand Events'
  }
]
</script>
