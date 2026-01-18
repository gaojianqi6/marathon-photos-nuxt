import { defineStore } from 'pinia'

export interface CartItem {
  product: string // 'dl_20x30', 'dl_eventcd', 'dl_digsuperpack', 'dl_megapack', '$movie'
  name: string
  price: number
  currency: string
  event: string // Event path for grouping
  photoId?: string // Only for single photos (dl_20x30)
  quantity?: number
}

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'marathon-photos-cart'

// Allowed product types
export const ALLOWED_PRODUCTS = {
  'dl_20x30': 'Single Photo',
  'dl_eventcd': 'All Event Photos',
  'dl_digsuperpack': 'Photos Plus',
  'dl_megapack': 'Your Photo Pack',
  '$movie': 'Video'
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: []
  }),

  getters: {
    totalItems: (state) => state.items.length,
    
    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    },

    // Get items grouped by event
    itemsByEvent: (state) => {
      const grouped: Record<string, CartItem[]> = {}
      state.items.forEach(item => {
        if (!grouped[item.event]) {
          grouped[item.event] = []
        }
        grouped[item.event].push(item)
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

    // Get total price for a specific event
    getEventTotalPrice: (state) => (event: string) => {
      const eventItems = state.items.filter(item => item.event === event)
      return eventItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    }
  },

  actions: {
    // Load cart from localStorage
    loadCart() {
      if (process.client) {
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
      if (process.client) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error)
        }
      }
    },

    // Add item to cart with replacement logic
    addItem(item: CartItem) {
      // Get items for this event
      const eventItems = this.items.filter(i => i.event === item.event)
      
      // Handle replacement logic based on product type
      if (item.product === 'dl_megapack') {
        // Photo Pack replaces Photos Plus and All Event Photos
        this.items = this.items.filter(i => 
          !(i.event === item.event && ['dl_digsuperpack', 'dl_eventcd'].includes(i.product))
        )
      } else if (item.product === 'dl_digsuperpack') {
        // Photos Plus replaces All Event Photos
        this.items = this.items.filter(i => 
          !(i.event === item.event && i.product === 'dl_eventcd')
        )
      } else if (item.product === 'dl_eventcd') {
        // All Event Photos replaces all single photos if total single photo price is higher
        const singlePhotos = eventItems.filter(i => i.product === 'dl_20x30')
        const singlePhotosTotal = singlePhotos.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0)
        
        if (singlePhotosTotal >= item.price) {
          // Remove all single photos and add All Event Photos
          this.items = this.items.filter(i => 
            !(i.event === item.event && i.product === 'dl_20x30')
          )
        } else {
          // Keep single photos, don't add All Event Photos
          return
        }
      } else if (item.product === 'dl_20x30') {
        // Single photo: check if total single photos price >= All Event Photos
        const singlePhotos = eventItems.filter(i => i.product === 'dl_20x30')
        const allEventPhotosItem = eventItems.find(i => i.product === 'dl_eventcd')
        
        const newSinglePhotosTotal = [...singlePhotos, item].reduce(
          (sum, i) => sum + (i.price * (i.quantity || 1)), 
          0
        )
        
        if (allEventPhotosItem && newSinglePhotosTotal >= allEventPhotosItem.price) {
          // Replace single photos with All Event Photos
          this.items = this.items.filter(i => 
            !(i.event === item.event && i.product === 'dl_20x30')
          )
          this.items.push(allEventPhotosItem)
          this.saveCart()
          return
        }
      }
      
      // Check if item already exists (for single photos with same photoId)
      if (item.product === 'dl_20x30' && item.photoId) {
        const existing = this.items.find(
          i => i.event === item.event && i.product === 'dl_20x30' && i.photoId === item.photoId
        )
        if (existing) {
          // Already in cart, don't add again
          return
        }
      } else {
        // For bundles, remove existing bundle of same type
        this.items = this.items.filter(
          i => !(i.event === item.event && i.product === item.product)
        )
      }
      
      // Add new item
      this.items.push(item)
      this.saveCart()
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