export default defineAppConfig({
  ui: {
    toaster: {
      position: 'bottom-right' as const,
      duration: 1000,
      max: 5,
      expand: true
    }
  }
})
