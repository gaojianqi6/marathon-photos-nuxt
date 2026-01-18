export default defineAppConfig({
  // Global toast/toaster configuration
  // These settings are used via UApp component's toaster prop
  toaster: {
    position: 'bottom-right' as const,
    duration: 2000,
    max: 5, // Maximum number of toasts
    expand: true
  }
})
