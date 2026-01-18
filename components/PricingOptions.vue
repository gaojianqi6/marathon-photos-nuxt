<template>
  <div class="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 sticky top-24">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Digital Download Options</h3>
    
    <div class="space-y-3">
      <div
        v-for="option in pricingOptions"
        :key="option.product"
        class="relative p-4 border-2 rounded-lg transition-all"
        :class="{
          'border-blue-500 bg-blue-50': selectedOption === option.product && !isDisabled(option.product) && !isExactProductInCart(option.product),
          'border-gray-200': selectedOption !== option.product && !isDisabled(option.product) && !isExactProductInCart(option.product),
          'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed': isDisabled(option.product),
          'border-green-500 bg-green-50': isExactProductInCart(option.product),
          'cursor-pointer hover:shadow-md': !isDisabled(option.product)
        }"
        @click="!isDisabled(option.product) && selectOption(option)"
      >
        <!-- In Cart Icon (absolute positioned top-right) - only show for exact match -->
        <div
          v-if="isExactProductInCart(option.product)"
          class="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center z-10"
          title="Already in cart"
        >
          <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="font-semibold text-gray-900">{{ option.name }}</div>
            <div v-if="option.description" class="text-sm text-gray-600 mt-1">
              {{ option.description }}
            </div>
            <div v-if="isDisabled(option.product)" class="text-xs text-gray-500 mt-1">
              {{ getDisabledReason(option.product) }}
            </div>
          </div>
          <div class="text-xl font-bold text-blue-600 ml-4">
            {{ formatPrice(option.price) }}
          </div>
        </div>
      </div>
    </div>

    <button
      :disabled="!selectedOption || isDisabled(selectedOption) || isExactProductInCart(selectedOption)"
      class="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      @click="addToCart"
    >
      {{ isExactProductInCart(selectedOption || '') ? 'Already in Cart' : 'Add to Cart' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

interface PricingOption {
  product: string
  name: string
  price: number
  description?: string
  currency?: string
}

interface Props {
  pricing: PricingOption[]
  currency?: string
  event?: string
}

const props = defineProps<Props>()
const selectedOption = ref<string | null>(null)
const cartStore = useCartStore()

const emit = defineEmits<{
  addToCart: [option: PricingOption]
}>()

// Map product codes to display names - only these 4 products are allowed
const productNames: Record<string, string> = {
  'dl_20x30': 'Single Photo',
  'dl_eventcd': 'All Event Photos',
  'dl_digsuperpack': 'Photos Plus',
  'dl_megapack': 'Your Photo Pack',
  '$movie': 'Video'
}

// Only allow these 3 bundle product types (exclude single photo - it's added via photo icons)
const ALLOWED_PRODUCTS = ['dl_eventcd', 'dl_digsuperpack', 'dl_megapack', '$movie']

const pricingOptions = computed(() => {
  return props.pricing
    .filter((item) => 
      item.price > 0 && // Filter out unavailable options (price -1)
      ALLOWED_PRODUCTS.includes(item.product) // Only show allowed products
    )
    .map((item) => ({
      ...item,
      name: productNames[item.product] || item.product,
      currency: props.currency || 'EUR'
    }))
})

// Check if the exact product is in cart
const isExactProductInCart = (product: string) => {
  if (!props.event) return false
  return cartStore.isProductInCart(props.event, product)
}

// Get the current product in cart for this event
const cartProduct = computed(() => {
  if (!props.event) return null
  return cartStore.getCartProduct(props.event)
})

// Check if an option should be disabled
const isDisabled = (product: string) => {
  if (!props.event || !cartProduct.value) return false
  
  const currentCart = cartProduct.value
  
  // Photo Pack (most expensive) - disable All Event Photos and Photos Plus
  if (currentCart === 'dl_megapack') {
    return product === 'dl_eventcd' || product === 'dl_digsuperpack'
  }
  
  // Photos Plus - disable All Event Photos only (Photo Pack can still be added)
  if (currentCart === 'dl_digsuperpack') {
    return product === 'dl_eventcd'
  }
  
  // All Event Photos - nothing is disabled (user can upgrade to Plus or Pack)
  // Video - nothing is disabled (it's independent)
  
  return false
}

// Get reason why an option is disabled
const getDisabledReason = (product: string) => {
  if (!props.event || !cartProduct.value) return ''
  
  const currentCart = cartProduct.value
  
  if (currentCart === 'dl_megapack') {
    return 'Included in Photo Pack'
  }
  
  if (currentCart === 'dl_digsuperpack' && product === 'dl_eventcd') {
    return 'Included in Photos Plus'
  }
  
  return ''
}

const selectOption = (option: PricingOption) => {
  if (isDisabled(option.product)) return
  selectedOption.value = option.product
}

const addToCart = () => {
  if (!selectedOption.value) return
  
  const option = pricingOptions.value.find(
    (opt) => opt.product === selectedOption.value
  )
  
  if (option) {
    emit('addToCart', option)
  }
}

const formatPrice = (price: number): string => {
  const currency = props.currency || 'EUR'
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  return `${symbol}${price.toFixed(2)}`
}
</script>
