<template>
  <div class="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 sticky top-24">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Digital Download Options</h3>
    
    <div class="space-y-3">
      <div
        v-for="option in pricingOptions"
        :key="option.product"
        class="relative p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer"
        :class="{
          'border-blue-500 bg-blue-50': selectedOption === option.product && !isProductInCart(option.product),
          'border-gray-200': selectedOption !== option.product && !isProductInCart(option.product)
        }"
        @click="selectOption(option)"
      >
        <!-- In Cart Icon (absolute positioned top-right) -->
        <div
          v-if="isProductInCart(option.product)"
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
          </div>
          <div class="text-xl font-bold text-blue-600 ml-4">
            {{ formatPrice(option.price) }}
          </div>
        </div>
      </div>
    </div>

    <button
      :disabled="!selectedOption"
      class="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      @click="addToCart"
    >
      Add to Cart
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

const isProductInCart = (product: string) => {
  if (!props.event) return false
  return cartStore.isProductInCart(props.event, product)
}

const selectOption = (option: PricingOption) => {
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
