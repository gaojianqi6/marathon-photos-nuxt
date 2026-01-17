<template>
  <header class="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <span class="text-white font-bold text-xl">MP</span>
          </div>
          <span class="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Marathon Photos
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            CONTACT
          </NuxtLink>
          <NuxtLink
            to="/recent-events"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            RECENT EVENTS
          </NuxtLink>

          <!-- Cart Icon -->
          <NuxtLink
            to="/cart"
            class="ml-4 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative"
            active-class="text-blue-600 bg-blue-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </NuxtLink>

          <!-- Language Switcher with Globe Icon -->
          <div class="ml-2 pl-2 border-l border-gray-200">
            <UDropdown
              :items="[[languageDropdownItems]]"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                variant="ghost"
                color="gray"
                size="sm"
                class="gap-2"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">{{ currentLanguageName }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </UButton>
            </UDropdown>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 pt-2 border-t border-gray-200 mt-2">
        <nav class="flex flex-col gap-2">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            @click="mobileMenuOpen = false"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/cart"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-2"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            CART
            <span v-if="cartCount > 0" class="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            @click="mobileMenuOpen = false"
          >
            CONTACT
          </NuxtLink>
          <NuxtLink
            to="/recent-events"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            @click="mobileMenuOpen = false"
          >
            RECENT EVENTS
          </NuxtLink>
          <div class="px-4 py-2">
            <UDropdown
              :items="[[languageDropdownItems]]"
              :popper="{ placement: 'bottom-end' }"
              class="w-full"
            >
              <UButton
                variant="ghost"
                color="gray"
                size="sm"
                class="w-full gap-2 justify-start"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium">{{ currentLanguageName }}</span>
              </UButton>
            </UDropdown>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const mobileMenuOpen = ref(false)
const cartCount = ref(0) // You can connect this to your cart store/composable

// Get current language name
const currentLanguageName = computed(() => {
  const current = (locales.value as Array<{ code: string; name: string; flag: string }>).find(
    (loc) => loc.code === locale.value
  )
  return current?.name || 'English'
})

// Create dropdown items for languages
const languageDropdownItems = computed(() => {
  return (locales.value as Array<{ code: string; name: string; flag: string }>).map((loc) => ({
    label: `${loc.flag} ${loc.name}`,
    click: () => {
      setLocale(loc.code)
    },
    active: locale.value === loc.code
  }))
})

// Watch for cart count changes (you can replace this with your cart store)
onMounted(() => {
  // Initialize cart count from store or localStorage
  // cartCount.value = useCartStore().items.length
})
</script>
