<template>
  <header class="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div class="rounded-lg px-3 py-2 backdrop-blur-sm" style="background-color: rgba(0, 215, 207, 0.5);">
            <img src="/img/logo.svg" alt="Marathon Photos Live" class="h-8 w-auto">
          </div>
          <span class="sr-only">Marathon Photos Live</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            {{ $t('nav.contact') }}
          </NuxtLink>
          <NuxtLink
            to="/recent-events"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
            active-class="text-blue-600 bg-blue-50 font-semibold"
          >
            {{ $t('nav.recentEvents') }}
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
          <div class="ml-2 pl-2 border-l border-gray-200 relative">
            <button
              aria-label="Toggle language"
              class="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm"
              @click="languageDropdownOpen = !languageDropdownOpen"
            >
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">{{ currentLanguageName }}</span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': languageDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Language Dropdown -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
            >
            <div
              v-if="languageDropdownOpen"
              ref="languageDropdownRef"
              class="absolute right-0 mt-2 w-56 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
                <div class="p-2">
                  <button
                    v-for="loc in availableLocales"
                    :key="loc.code"
                    :class="[
                      'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                      locale === loc.code
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    ]"
                    @click="changeLanguage(loc.code)"
                  >
                    <span class="text-lg">{{ loc.flag }}</span>
                    <span class="flex-1">{{ loc.name }}</span>
                    <svg
                      v-if="locale === loc.code"
                      class="w-4 h-4 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
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
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            to="/cart"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-2"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ $t('nav.cart') }}
            <span v-if="cartCount > 0" class="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.contact') }}
          </NuxtLink>
          <NuxtLink
            to="/recent-events"
            class="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.recentEvents') }}
          </NuxtLink>
          <div class="px-4 py-2 relative">
            <button
              class="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium text-sm"
              @click="mobileLanguageDropdownOpen = !mobileLanguageDropdownOpen"
            >
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium flex-1 text-left">{{ currentLanguageName }}</span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': mobileLanguageDropdownOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Mobile Language Dropdown -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-if="mobileLanguageDropdownOpen"
                class="mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  v-for="loc in availableLocales"
                  :key="loc.code"
                  :class="[
                    'w-full text-left px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-2',
                    locale === loc.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                  @click="changeLanguage(loc.code)"
                >
                  <span class="text-lg">{{ loc.flag }}</span>
                  <span class="flex-1">{{ loc.name }}</span>
                  <svg
                    v-if="locale === loc.code"
                    class="w-4 h-4 text-blue-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const mobileMenuOpen = ref(false)
const languageDropdownOpen = ref(false)
const mobileLanguageDropdownOpen = ref(false)
const cartCount = ref(0) // You can connect this to your cart store/composable

// Get available locales
const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string; flag: string }>)
})

// Get current language name
const currentLanguageName = computed(() => {
  const current = availableLocales.value.find((loc) => loc.code === locale.value)
  return current?.name || 'English'
})

// Change language function
const changeLanguage = async (langCode: string) => {
  await setLocale(langCode as 'en' | 'en-US' | 'de' | 'cs' | 'da' | 'es' | 'fr' | 'el' | 'it' | 'ja' | 'nl' | 'no' | 'is' | 'pt' | 'sv' | 'zh-CN' | 'zh-TW')
  languageDropdownOpen.value = false
  mobileLanguageDropdownOpen.value = false
  mobileMenuOpen.value = false
}

// Handle click outside for language dropdown
const languageDropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (
    languageDropdownRef.value &&
    !languageDropdownRef.value.contains(event.target as Node) &&
    !(event.target as HTMLElement).closest('button[aria-label="Toggle language"]')
  ) {
    languageDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Initialize cart count from store or localStorage
  // cartCount.value = useCartStore().items.length
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>
