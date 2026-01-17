export default defineEventHandler(async (event) => {
  const eventPathParam = getRouterParam(event, 'event')
  const query = getQuery(event)
  const bib = query.bib as string

  if (!eventPathParam || !bib) {
    setResponseStatus(event, 400)
    return {
      status: 'error',
      reason: 'Event and bib number are required'
    }
  }

  try {
    // Handle both single param and catch-all route (array)
    let eventPath: string
    if (Array.isArray(eventPathParam)) {
      // Join array elements with slashes for catch-all route
      eventPath = eventPathParam.join('/')
    } else {
      eventPath = eventPathParam as string
    }
    
    // Decode in case it's still encoded
    try {
      eventPath = decodeURIComponent(eventPath)
    } catch {
      // Already decoded or decode failed, use as is
    }
    
    // Build the API URL with properly encoded parameters
    const apiUrl = `https://api.marathon-photos.com/website_api/v7/details?event=${encodeURIComponent(eventPath)}&bib=${encodeURIComponent(bib)}`
    
    console.log('API Request - Event Path:', eventPath)
    console.log('API Request - Bib:', bib)
    console.log('API Request - URL:', apiUrl)
    
    const response = await $fetch(apiUrl)

    if (!response || (response as any).status === 'error') {
      return {
        status: 'error',
        reason: (response as any)?.reason || 'No photos found for this bib number'
      }
    }

    return response
  } catch (error: any) {
    console.error('Event API error:', error)
    
    // Handle different error types
    if (error.response) {
      // HTTP error response
      const errorData = error.response._data || error.response.data
      return {
        status: 'error',
        reason: errorData?.reason || `API Error: ${error.response.status}`
      }
    }
    
    if (error.data) {
      // Error with data property
      return {
        status: 'error',
        reason: error.data.reason || error.data.message || 'Failed to fetch athlete photos'
      }
    }
    
    return {
      status: 'error',
      reason: error.message || 'Failed to fetch athlete photos. Please check the bib number and try again.'
    }
  }
})
