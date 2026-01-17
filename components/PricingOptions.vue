<template>
  <div class="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 sticky top-24">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Digital Download Options</h3>
    
    <div class="space-y-3">
      <div
        v-for="option in pricingOptions"
        :key="option.product"
        class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
        :class="{ 'border-blue-500 bg-blue-50': selectedOption === option.product }"
        @click="selectOption(option)"
      >
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
      @click="addToCart"
      :disabled="!selectedOption"
      class="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add to Cart
    </button>
  </div>
</template>

<script setup lang="ts">
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
}

const props = defineProps<Props>()
const selectedOption = ref<string | null>(null)

const emit = defineEmits<{
  addToCart: [option: PricingOption]
}>()

// Map product codes to display names
const productNames: Record<string, string> = {
  'dl_20x30': 'Single Photo',
  'dl_eventcd': 'All Event Photos',
  'dl_digsuperpack': 'Photos Plus',
  'dl_megapack': 'Your Photo Pack',
  '$movie': 'Video'
}

const pricingOptions = computed(() => {
  return props.pricing
    .filter((item) => item.price > 0) // Filter out unavailable options (price -1)
    .map((item) => ({
      ...item,
      name: productNames[item.product] || item.product,
      currency: props.currency || 'EUR'
    }))
})

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
    // TODO: Show success message
  }
}

const formatPrice = (price: number): string => {
  const currency = props.currency || 'EUR'
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  return `${symbol}${price.toFixed(2)}`
}
</script>
