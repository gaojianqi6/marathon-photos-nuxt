import { defineStore } from 'pinia'

export interface CartItem {
  product: string // 'dl_20x30', 'dl_eventcd', 'dl_digsuperpack', 'dl_megapack', '$movie'
  name: string
  price: number
  currency: string
  event: string // Event path for grouping
  photoId?: string // Only for single photos (dl_20x30)
  bibNumber?: string // Bib number associated with the item
  quantity?: number
}

interface PricingOption {
  product: string
  name: string
  price: number
  description?: string
  currency?: string
}

interface CartState {
  items: CartItem[]
}

export interface AddItemResult {
  success: boolean
  replacedItems?: string[]
  message?: string
  alreadyInCart?: boolean
}

const STORAGE_KEY = 'marathon-photos-cart'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.length,
    totalItems: (state) => state.items.length, // Alias for itemCount for compatibility
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),

    // Get items grouped by event
    itemsByEvent: (state) => {
      const grouped: Record<string, CartItem[]> = {}
      state.items.forEach(item => {
        if (!grouped[item.event]) {
          grouped[item.event] = []
        }
        if (grouped[item.event]) {
          grouped[item.event].push(item)
        }
      })
      return grouped
    },

    // Check if a photo is already in cart (either as single or included in bundle)
    isPhotoInCart: (state) => (event: string, photoId: string) => {
      const eventItems = state.items.filter(item => item.event === event)
      
      // Check if photo is added as single photo
      const isSinglePhoto = eventItems.some(
        item => item.product === 'dl_20x30' && item.photoId === photoId
      )
      
      if (isSinglePhoto) return true
      
      // Check if photo is included in a bundle (All Event Photos, Photos Plus, or Photo Pack)
      const hasBundle = eventItems.some(
        item => ['dl_eventcd', 'dl_digsuperpack', 'dl_megapack'].includes(item.product)
      )
      
      return hasBundle
    },

    // Check if a specific product is already in cart
    isProductInCart: (state) => (event: string, product: string) => {
      const eventItems = state.items.filter(item => item.event === event)
      
      // Check for exact product match
      return eventItems.some(item => item.product === product)
    },
    
    // Get the specific product in cart for this event (returns product code or null)
    getCartProduct: (state) => (event: string) => {
      const eventItems = state.items.filter(item => item.event === event)
      
      // Check for bundles in order: Pack > Plus > All (most expensive first)
      const photoPack = eventItems.find(item => item.product === 'dl_megapack')
      if (photoPack) return 'dl_megapack'
      
      const photosPlus = eventItems.find(item => item.product === 'dl_digsuperpack')
      if (photosPlus) return 'dl_digsuperpack'
      
      const allEventPhotos = eventItems.find(item => item.product === 'dl_eventcd')
      if (allEventPhotos) return 'dl_eventcd'
      
      // Check for video
      const video = eventItems.find(item => item.product === '$movie')
      if (video) return '$movie'
      
      return null
    },

    // Get total price for a specific event
    getEventTotalPrice: (state) => (event: string) => {
      const eventItems = state.items.filter(item => item.event === event)
      return eventItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    }
  },

  actions: {
    // Load cart from localStorage
    loadCart() {
      if (import.meta.client) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            this.items = JSON.parse(stored)
          }
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error)
          this.items = []
        }
      }
    },

    // Save cart to localStorage
    saveCart() {
      if (import.meta.client) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error)
        }
      }
    },

    // Add item to cart with replacement logic
    // Replacement hierarchy: Single -> All -> Plus -> Pack
    // Only one of All/Plus/Pack can exist (expensive one includes cheaper ones)
    // Returns: { success: boolean, replacedItems?: string[], message?: string }
    addItem(item: CartItem, allEventPhotosOption?: { product: string; price: number } | null): AddItemResult {
      // Get items for this event
      const eventItems = this.items.filter(i => i.event === item.event)
      const replacedItems: string[] = []
      
      // Handle replacement logic based on product type
      if (item.product === 'dl_megapack') {
        // Photo Pack (most expensive) replaces Photos Plus, All Event Photos, and all single photos
        const removedItems = eventItems.filter(i => ['dl_digsuperpack', 'dl_eventcd', 'dl_20x30'].includes(i.product))
        removedItems.forEach(i => {
          if (i.product === 'dl_digsuperpack') replacedItems.push('Photos Plus')
          else if (i.product === 'dl_eventcd') replacedItems.push('All Event Photos')
          else if (i.product === 'dl_20x30') replacedItems.push(`${removedItems.filter(x => x.product === 'dl_20x30').length} single photo(s)`)
        })
        this.items = this.items.filter(i => 
          !(i.event === item.event && ['dl_digsuperpack', 'dl_eventcd', 'dl_20x30'].includes(i.product))
        )
      } else if (item.product === 'dl_digsuperpack') {
        // Photos Plus replaces All Event Photos and all single photos
        // But if Photo Pack exists, don't add Photos Plus
        const hasPhotoPack = eventItems.some(i => i.product === 'dl_megapack')
        if (hasPhotoPack) {
          // Photo Pack already includes Photos Plus, don't add
          return { success: false, alreadyInCart: true, message: 'Photo Pack already includes Photos Plus' }
        }
        const removedItems = eventItems.filter(i => ['dl_eventcd', 'dl_20x30'].includes(i.product))
        removedItems.forEach(i => {
          if (i.product === 'dl_eventcd') replacedItems.push('All Event Photos')
          else if (i.product === 'dl_20x30') replacedItems.push(`${removedItems.filter(x => x.product === 'dl_20x30').length} single photo(s)`)
        })
        this.items = this.items.filter(i => 
          !(i.event === item.event && ['dl_eventcd', 'dl_20x30'].includes(i.product))
        )
      } else if (item.product === 'dl_eventcd') {
        // All Event Photos replaces all single photos (always, when adding directly)
        // But if Photos Plus or Photo Pack exists, don't add All Event Photos
        const hasPhotoPack = eventItems.some(i => i.product === 'dl_megapack')
        const hasPhotosPlus = eventItems.some(i => i.product === 'dl_digsuperpack')
        if (hasPhotoPack || hasPhotosPlus) {
          // Bundle already includes All Event Photos, don't add
          return { success: false, alreadyInCart: true, message: 'Already included in a bundle' }
        }
        
        // Check if All Event Photos already exists
        const existingAllEventPhotos = eventItems.find(i => i.product === 'dl_eventcd')
        if (existingAllEventPhotos) {
          return { success: false, alreadyInCart: true, message: 'All Event Photos is already in cart' }
        }
        
        // When adding All Event Photos directly, always replace single photos
        const singlePhotos = eventItems.filter(i => i.product === 'dl_20x30')
        if (singlePhotos.length > 0) {
          // Always remove all single photos when adding All Event Photos directly
          replacedItems.push(`${singlePhotos.length} single photo(s)`)
          this.items = this.items.filter(i => 
            !(i.event === item.event && i.product === 'dl_20x30')
          )
        }
      } else if (item.product === 'dl_20x30') {
        // Single photo: check replacement logic
        
        // If Photo Pack or Photos Plus exists, don't add single photo (it's already included)
        const hasPhotoPack = eventItems.some(i => i.product === 'dl_megapack')
        const hasPhotosPlus = eventItems.some(i => i.product === 'dl_digsuperpack')
        if (hasPhotoPack || hasPhotosPlus) {
          return { success: false, alreadyInCart: true, message: 'Photo is already included in a bundle' }
        }
        
        // Check if this single photo already exists
        const existing = this.items.find(
          i => i.event === item.event && i.product === 'dl_20x30' && i.photoId === item.photoId
        )
        if (existing) {
          // Already in cart, don't add again
          return { success: false, alreadyInCart: true, message: 'Photo is already in cart' }
        }
        
        // Check if total single photos price >= All Event Photos
        const singlePhotos = eventItems.filter(i => i.product === 'dl_20x30')
        const existingAllEventPhotosItem = eventItems.find(i => i.product === 'dl_eventcd')
        
        // Get All Event Photos price from option passed in, or from existing cart item
        let allEventPhotosPrice: number | null = null
        
        if (allEventPhotosOption) {
          allEventPhotosPrice = allEventPhotosOption.price
        } else if (existingAllEventPhotosItem) {
          allEventPhotosPrice = existingAllEventPhotosItem.price
        }
        
        // Calculate new total with this single photo added
        const newSinglePhotosTotal = [...singlePhotos, item].reduce(
          (sum, i) => sum + (i.price * (i.quantity || 1)), 
          0
        )
        
        // If we have All Event Photos price and total single photos >= it, replace with All Event Photos
        if (allEventPhotosPrice !== null && newSinglePhotosTotal >= allEventPhotosPrice) {
          // Replace all single photos with All Event Photos
          if (singlePhotos.length > 0) {
            replacedItems.push(`${singlePhotos.length + 1} single photo(s)`)
          }
          this.items = this.items.filter(i => 
            !(i.event === item.event && i.product === 'dl_20x30')
          )
          
          // Create or update All Event Photos item
          if (existingAllEventPhotosItem) {
            // Update existing All Event Photos item (preserve its data, just update bibNumber if needed)
            const index = this.items.findIndex(i => i.event === item.event && i.product === 'dl_eventcd')
            if (index !== -1 && this.items[index]) {
              this.items[index].bibNumber = item.bibNumber || this.items[index].bibNumber
            }
          } else {
            // Need to create All Event Photos item - need price info
            if (!allEventPhotosOption) {
              // Can't create All Event Photos without price info, just add the single photo
              this.items.push(item)
              this.saveCart()
              return { success: true }
            }
            // Create new All Event Photos item
            this.items.push({
              product: 'dl_eventcd',
              name: 'All Event Photos',
              price: allEventPhotosPrice,
              currency: item.currency,
              event: item.event,
              bibNumber: item.bibNumber
            })
          }
          this.saveCart()
          return { success: true, replacedItems, message: 'Replaced single photos with All Event Photos' }
        }
      } else if (item.product === '$movie') {
        // Video is a standalone product, no replacement logic with photos
        // Check if video already exists for this event
        const existingVideo = eventItems.find(i => i.product === '$movie')
        if (existingVideo) {
          // Video already in cart, don't add again
          return { success: false, alreadyInCart: true, message: 'Video is already in cart' }
        }
      }

      // For bundles (All/Plus/Pack), remove existing bundle of same type or lower tier
      if (['dl_eventcd', 'dl_digsuperpack', 'dl_megapack'].includes(item.product)) {
        const removedBundles = eventItems.filter(
          i => ['dl_eventcd', 'dl_digsuperpack', 'dl_megapack'].includes(i.product)
        )
        removedBundles.forEach(i => {
          if (i.product === 'dl_eventcd') replacedItems.push('All Event Photos')
          else if (i.product === 'dl_digsuperpack') replacedItems.push('Photos Plus')
          else if (i.product === 'dl_megapack') replacedItems.push('Photo Pack')
        })
        // Remove all photo bundles for this event (they're mutually exclusive)
        this.items = this.items.filter(
          i => !(i.event === item.event && ['dl_eventcd', 'dl_digsuperpack', 'dl_megapack'].includes(i.product))
        )
      }
      
      // Add new item
      this.items.push(item)
      this.saveCart()
      
      return { 
        success: true, 
        replacedItems: replacedItems.length > 0 ? replacedItems : undefined,
        message: replacedItems.length > 0 ? `Replaced ${replacedItems.join(', ')}` : undefined
      }
    },

    // Remove item from cart
    removeItem(event: string, product: string, photoId?: string) {
      this.items = this.items.filter(item => {
        if (item.event !== event || item.product !== product) return true
        if (product === 'dl_20x30' && photoId) {
          return item.photoId !== photoId
        }
        return false
      })
      this.saveCart()
    },

    // Clear cart
    clearCart() {
      this.items = []
      this.saveCart()
    },

    // Clear cart for a specific event
    clearEvent(event: string) {
      this.items = this.items.filter(item => item.event !== event)
      this.saveCart()
    }
  }
})
