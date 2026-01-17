<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-2xl mx-auto">
             <!-- 404 Illustration -->
             <div class="mb-2">
               <svg class="w-16 h-16 max-w-[64px] mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path
                   stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>

            <!-- Error Number -->
            <h1
              class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              404
            </h1>

            <!-- Error Message -->
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p class="text-xl text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <NuxtLink
                to="/"
                class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold w-full sm:w-[200px]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Home
              </NuxtLink>

              <NuxtLink
                to="/recent-events"
                class="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold w-full sm:w-[200px]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Browse Events
              </NuxtLink>
            </div>

            <!-- Quick Links -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <p class="text-gray-600 mb-4">Or try one of these pages:</p>
              <div class="flex flex-wrap gap-4 justify-center">
                <NuxtLink
to="/recent-events"
                  class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Recent Events
                </NuxtLink>
                <NuxtLink
to="/contact"
                  class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Contact Us
                </NuxtLink>
                <NuxtLink
to="/organisers"
                  class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Event Organisers
                </NuxtLink>
                <NuxtLink
to="/photographer"
                  class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Photographer Registration
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Nuxt error page - this will handle 404 and other errors
const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

// Set page title
useHead({
  title: props.error?.statusCode === 404 ? '404 - Page Not Found' : 'Error - Marathon Photos'
})
</script>
