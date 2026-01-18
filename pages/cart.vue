<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/"
            class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </NuxtLink>
          <div class="text-lg text-gray-600">
            Shopping Cart Items: <span class="font-bold text-gray-900">{{ cartStore.totalItems }}</span>
          </div>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-if="cartStore.totalItems > 0" class="space-y-8">
        <!-- Items grouped by event -->
        <div
          v-for="(items, event) in cartStore.itemsByEvent"
          :key="event"
          class="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden"
        >
          <!-- Event Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h2 class="text-xl font-bold mb-1">{{ formatEventPath(event) }}</h2>
              </div>
              <NuxtLink
                :to="getEventLink(event, items)"
                class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
              >
                View Event
              </NuxtLink>
            </div>
          </div>

          <!-- Event Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="item in items"
                :key="`${item.event}-${item.product}-${item.photoId || ''}`"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-4">
                    <!-- Item Icon/Image -->
                    <div
                      v-if="item.product === '$movie'"
                      class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div
                      v-else
                      class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <!-- Item Details -->
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 mb-1">{{ item.name }}</h3>
                      <p v-if="item.photoId" class="text-sm text-gray-500">Photo ID: {{ item.photoId }}</p>
                      <p class="text-sm text-gray-500">Event: {{ formatEventPath(event) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Price and Delete -->
                <div class="flex items-center gap-6">
                  <div class="text-right">
                    <div class="text-xl font-bold text-gray-900">{{ formatPrice(item.price, item.currency) }}</div>
                    <div v-if="item.quantity && item.quantity > 1" class="text-sm text-gray-500">
                      Qty: {{ item.quantity }}
                    </div>
                  </div>
                  <button
                    @click="removeItem(item)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Event Total -->
            <div class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <span class="text-lg font-semibold text-gray-700">Event Total:</span>
              <span class="text-2xl font-bold text-gray-900">
                {{ formatPrice(cartStore.getEventTotalPrice(event), items[0].currency) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 sticky bottom-0">
          <div class="flex items-center justify-between mb-6">
            <span class="text-2xl font-bold text-gray-900">Total:</span>
            <span class="text-3xl font-bold text-blue-600">
              {{ formatTotalPrice() }}
            </span>
          </div>
          <button
            @click="handleCheckout"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-bold text-lg"
          >
            Checkout
          </button>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p class="text-lg text-gray-600 mb-8">Start adding photos to your cart!</p>
        <NuxtLink
          to="/recent-events"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          Browse Events
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/stores/cart'

const cartStore = useCartStore()

// Load cart on mount
onMounted(() => {
  cartStore.loadCart()
})

// Format event path for display
const formatEventPath = (eventPath: string): string => {
  // Decode and format the event path for better display
  try {
    const decoded = decodeURIComponent(eventPath)
    return decoded.split('/').pop() || decoded
  } catch {
    return eventPath.split('/').pop() || eventPath
  }
}

// Format price
const formatPrice = (price: number, currency: string = 'EUR'): string => {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  return `${symbol}${price.toFixed(2)}`
}

// Format total price (handle multiple currencies)
const formatTotalPrice = (): string => {
  if (cartStore.totalItems === 0) return '€0.00'
  
  // Get unique currencies
  const currencies = new Set(cartStore.items.map(item => item.currency))
  
  if (currencies.size === 1) {
    // Single currency
    const currency = Array.from(currencies)[0]
    return formatPrice(cartStore.totalPrice, currency)
  } else {
    // Multiple currencies - show breakdown
    return 'See item prices'
  }
}

// Remove item from cart
const removeItem = (item: CartItem) => {
  cartStore.removeItem(item.event, item.product, item.photoId)
}

// Get event link with bib number if available
const getEventLink = (event: string, items: CartItem[]): string => {
  // Find bib number from items (items in same event should have same bib if any)
  const itemWithBib = items.find(item => item.bibNumber)
  if (itemWithBib?.bibNumber) {
    return `/event/${encodeURIComponent(event)}/${itemWithBib.bibNumber}`
  }
  return `/event/${encodeURIComponent(event)}`
}

// Handle checkout
const handleCheckout = () => {
  // TODO: Implement checkout functionality
  console.log('Checkout:', cartStore.items)
  alert('Checkout functionality will be implemented soon!')
}
</script>
