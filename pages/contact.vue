<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Header Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 lg:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6 text-center">Contact Us</h1>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Registration Options -->
          <div class="space-y-6">
            <div class="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Event Organisers</h2>
              <p class="text-gray-600 mb-6">Register Your Event with Us!</p>
              <NuxtLink
                to="/organisers"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Register Your Event
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
            </div>

            <div class="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Are you a Photographer?</h2>
              <p class="text-gray-600 mb-6">Register With us</p>
              <NuxtLink
                to="/photographer"
                class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Register With Us
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Your Name"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <!-- Email -->
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
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <!-- Event Name -->
              <div>
                <label for="eventName" class="block text-sm font-medium text-gray-700 mb-2">
                  Event name
                </label>
                <input
                  id="eventName"
                  v-model="form.eventName"
                  type="text"
                  placeholder="Search for an Event"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <!-- Bib Number -->
              <div>
                <label for="bibNumber" class="block text-sm font-medium text-gray-700 mb-2">
                  Bib number (if known)
                </label>
                <input
                  id="bibNumber"
                  v-model="form.bibNumber"
                  type="text"
                  placeholder="Bib number (if known)"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <!-- Order Number -->
              <div>
                <label for="orderNumber" class="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  id="orderNumber"
                  v-model="form.orderNumber"
                  type="text"
                  placeholder="Order Number (If Known)"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="5"
                  required
                  placeholder="Message"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting">Submit</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Customer Service Locations -->
        <div class="mt-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Customer Service</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Head Office: New Zealand -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Head Office: New Zealand</h3>
              <div class="space-y-2 text-gray-700">
                <p>PO Box 60</p>
                <p>Waikato Mail Centre</p>
                <p>Hamilton 3240</p>
                <p>New Zealand</p>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-gray-700">85b Church Road</p>
                <p class="text-gray-700">Pukete</p>
                <p class="text-gray-700">Hamilton 3200</p>
                <p class="text-gray-700">New Zealand</p>
              </div>
              <p class="mt-4 text-blue-600 font-medium">TEL: +64 7 838 2968</p>
            </div>

            <!-- Canada -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Canada</h3>
              <div class="space-y-2 text-gray-700">
                <p>Kelowna B.C</p>
                <p>V1P 1R4</p>
                <p>Canada</p>
              </div>
            </div>

            <!-- Germany -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Germany</h3>
              <div class="space-y-2 text-gray-700">
                <p>Vordere Weichselgartenstr. 12a</p>
                <p>90522 Oberasbach,</p>
                <p>Deutschland</p>
              </div>
              <p class="mt-4 text-blue-600 font-medium">Tel. +49 (0)911 9996 8571</p>
            </div>

            <!-- UK -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">UK</h3>
              <p class="text-blue-600 font-medium">TEL. +44 (0) 1628 478130</p>
            </div>

            <!-- China -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">China</h3>
              <div class="space-y-2 text-gray-700">
                <p>Marathon-Photos.com</p>
                <p>aixu Road 980#, Gaodong town</p>
                <p>Pudong new district, Shanghai 200137</p>
                <p>China</p>
              </div>
              <p class="mt-4 text-blue-600 font-medium">TEL. +86-189-1867-9768</p>
            </div>

            <!-- Netherlands -->
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Netherlands</h3>
              <div class="space-y-2 text-gray-700">
                <p>Marathon-Photos.com</p>
              </div>
              <p class="mt-4 text-blue-600 font-medium">TEL. +31624929044</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  eventName: '',
  bibNumber: '',
  orderNumber: '',
  message: ''
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
  alert('Thank you for contacting us! We will get back to you soon.')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    eventName: '',
    bibNumber: '',
    orderNumber: '',
    message: ''
  }
}
</script>
