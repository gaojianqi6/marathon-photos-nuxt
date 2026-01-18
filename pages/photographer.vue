<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 lg:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6 text-center">Photographer Registration</h1>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Left Column: What should you bring? -->
          <div class="lg:col-span-3">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">What should you bring?</h2>
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <ul class="space-y-3 text-gray-700">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Your passion, energy and skill for the craft of photography</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>The knowledge that you will be outdoors in all weather and seasons</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ready to work with big teams on large scale events</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Have a sound understanding of Photography</span>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Have your own camera equipment with wide angle and telephoto lens and at least 2-3 batteries for your camera</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Column: Race photographers Title + Why Register + Form -->
          <div class="lg:col-span-9">
            <!-- Race photographers Title -->
            <div class="mb-4">
              <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Race photographers</h2>
              <p class="text-sm text-gray-600">Apply now as a freelance photographer at Marathon Photos.</p>
            </div>

            <!-- Why Register Section -->
            <div class="mb-6">
              <h3 class="text-base font-bold text-gray-900 mb-2">Why Register with Marathon Photos?</h3>
              <p class="text-sm text-gray-700 leading-relaxed">
                By registering, you'll enable our photographic partners to reach out to you when opportunities arise in your area. Whenever we have an event in your region that needs coverage, we'll notify registered photographers with details about the location, event date, and payment rate.
              </p>
            </div>

            <!-- Registration Form -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-5">Your Contact Details</h3>
              <form class="space-y-4" @submit.prevent="handleSubmit">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  placeholder="Last Name"
                  class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
              </div>

              <!-- Email address -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Email address"
                  class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
              </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">Register With Us</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering...
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // TODO: Implement form submission logic
  console.log('Form submitted:', form.value)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isSubmitting.value = false
  
  // TODO: Show success message
  alert('Thank you for registering! We will contact you when opportunities arise in your area.')
  
  // Reset form
  form.value = {
    firstName: '',
    lastName: '',
    email: ''
  }
}
</script>
