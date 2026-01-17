export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string

  if (!searchQuery) {
    return {
      status: 'error',
      reason: 'Please enter part of event name.'
    }
  }

  try {
    const response = await $fetch('https://api.marathon-photos.com/website_api/v7/search', {
      params: {
        group: 'Sports',
        q: searchQuery,
        limit: 100
      }
    })

    return response
  } catch (error) {
    console.error('Search API error:', error)
    return {
      status: 'error',
      reason: 'Failed to search events. Please try again.'
    }
  }
})
