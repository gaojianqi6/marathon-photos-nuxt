<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- Search Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        :class="[
          'px-6 py-3 font-medium text-sm transition-colors border-b-2',
          searchMode === 'bib'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900'
        ]"
        @click="searchMode = 'bib'"
      >
        Search by Bib Number
      </button>
      <button
        :class="[
          'px-6 py-3 font-medium text-sm transition-colors border-b-2',
          searchMode === 'photo'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900'
        ]"
        @click="searchMode = 'photo'"
      >
        Upload Photo to Search
      </button>
    </div>

    <!-- Bib Number Search -->
    <div v-if="searchMode === 'bib'" class="space-y-4">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </div>
        <input
          v-model="bibNumber"
          type="text"
          placeholder="Enter your bib number..."
          class="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 placeholder:text-gray-400 bg-white"
          @keydown.enter="searchByBib"
        />
      </div>
      <button
        @click="searchByBib"
        :disabled="!bibNumber.trim() || isLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading">Search Photos</span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Searching...
        </span>
      </button>
    </div>

    <!-- Photo Upload Search -->
    <div v-else class="space-y-4">
      <div class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />
        <div class="flex flex-col items-center gap-4">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p class="text-gray-600 font-medium mb-1">Upload your photo to find similar images</p>
            <p class="text-sm text-gray-500">Click here or drag and drop</p>
          </div>
          <button
            @click="fileInputRef?.click()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Choose File
          </button>
        </div>
      </div>
      <div v-if="uploadedFile" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          File selected: {{ uploadedFile.name }}
        </p>
        <button
          @click="searchByPhoto"
          :disabled="isLoading"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Search with this photo
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md">
        <p class="text-red-800 text-sm font-medium">{{ errorMessage }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  eventPath: string
}>()

const emit = defineEmits<{
  photosFound: [data: any]
}>()

const searchMode = ref<'bib' | 'photo'>('bib')
const bibNumber = ref('')
const uploadedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const searchByBib = async () => {
  if (!bibNumber.value.trim()) {
    errorMessage.value = 'Please enter a bib number'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // For catch-all routes, we need to encode each segment separately
    // Split by slashes, encode each segment, then join back
    const eventSegments = props.eventPath.split('/').filter(Boolean)
    const encodedSegments = eventSegments.map(segment => encodeURIComponent(segment))
    const apiPath = encodedSegments.join('/')
    
    const response = await $fetch<{
      status: string
      athlete?: any
      event?: any
      reason?: string
    }>(`/api/event/${apiPath}`, {
      params: {
        bib: bibNumber.value.trim()
      },
      retry: 0
    })

    if (response && response.status === 'ok' && response.athlete) {
      emit('photosFound', response)
      errorMessage.value = ''
    } else if (response && response.status === 'error') {
      errorMessage.value = response.reason || 'No photos found for this bib number'
    } else {
      errorMessage.value = 'No photos found for this bib number. Please check the bib number and try again.'
    }
  } catch (error: any) {
    console.error('Search error:', error)
    
    // Extract error message from various error formats
    let errorMsg = 'Failed to search photos. Please try again.'
    
    if (error.data) {
      errorMsg = error.data.reason || error.data.message || errorMsg
    } else if (error.response?._data) {
      errorMsg = error.response._data.reason || error.response._data.message || errorMsg
    } else if (error.message) {
      errorMsg = error.message
    }
    
    errorMessage.value = errorMsg
  } finally {
    isLoading.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
    errorMessage.value = ''
  }
}

const searchByPhoto = async () => {
  if (!uploadedFile.value) {
    errorMessage.value = 'Please upload a photo first'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // TODO: Implement photo upload search API
    // For now, show a placeholder message
    errorMessage.value = 'Photo upload search is coming soon!'
    
    // When API is ready, you can use FormData like this:
    // const formData = new FormData()
    // formData.append('photo', uploadedFile.value)
    // formData.append('event', props.eventPath)
    // const response = await $fetch('/api/search-by-photo', {
    //   method: 'POST',
    //   body: formData
    // })
  } catch (error) {
    console.error('Photo search error:', error)
    errorMessage.value = 'Failed to search by photo. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
