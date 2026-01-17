export default defineEventHandler(async () => {
  try {
    const response = await $fetch(
      'https://api.marathon-photos.com/website_api/v7/search?group=Sports&limit=20&upcoming=0'
    )

    return response
  } catch (error) {
    console.error('Recent Events API error:', error)
    return {
      status: 'error',
      reason: 'Failed to fetch recent events. Please try again.'
    }
  }
})
