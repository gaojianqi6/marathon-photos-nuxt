This is a website rebuild of [Marathon Photos Live](https://marathonphotos.live/), a platform designed for three main user types:

- **Athletes** (primary users) - Search for and purchase their event photos
- **Event Organisers** - Register and manage events
- **Photographers** - Provide contact details for event coverage opportunities

## Core Features & User Flow

### Home Page
Athletes use the search functionality to find and navigate to specific events.

### Event / Competition Page
Athletes can search for their photos using their bib number or by uploading a face image for recognition. Selected photos can be added to the cart for purchase.

### Cart & Checkout
Users can review their selected photos, place orders in the appropriate currency, and proceed to payment through a third-party payment provider.

### Registration Pages
Event organisers can register new events, while photographers can submit their contact information to be notified of coverage opportunities.

### Supporting Pages
Additional pages include Recent Events, Media Releases, and FAQ for support and information.

### Multi-language Support
The site supports multiple languages, making it accessible for international events and users worldwide.

## API Overview

All API responses use a `status` field to indicate request status: `ok`, `error`, or other status values.

### 1. Search Events

**Endpoint:** `https://api.marathon-photos.com/website_api/v7/search?group=Sports&q=marathon&limit=100`

**Parameters:**
- `q` - Search keyword for event names
- `limit` - Maximum number of results to return

**Success Response (with results):**
```json
{
  "status": "ok",
  "result": [
    {
      "country": "US",
      "live": 0,
      "display_name": {"en": "DONNA Marathon Weekend - Sunday"},
      "event": "Sports/MPUS/2026/DONNA Marathon Weekend - Sunday",
      "eventid": "10880",
      "date": "2026-02-01"
    }
  ]
}
```

**Success Response (no results):**
```json
{
  "status": "ok",
  "result": []
}
```

**Error Response:**
```json
{
  "status": "error",
  "reason": "Exception: Please enter part of event name. handling search"
}
```

**Note:** When displaying event names, use the format: `Month Abbreviation Year: display_name.en`

## Tech Stack

- **Nuxt.js** - Server-side rendering (SSR) for improved SEO and API request handling
- **Vue 3** - Modern reactive framework for building interactive user interfaces
- **Nuxt UI** - Component library for creating beautiful, consistent UI elements
- **Nuxt Image** - Image optimization with lazy loading and masonry layout support to improve performance and reduce unnecessary image requests
- **Nuxt i18n** - Internationalization module for multi-language support
- **Pinia** - State management for shopping cart and application state

## Page Structure

### Header (All Pages)
Navigation links: Home, Cart, Contact, Recent Events

**Header Actions:**
- Language selector supporting: English, Deutsch (German), Czech, 简体中文 (Simplified Chinese)

### Footer (All Pages)

**About Us:**
Marathon Photos Live is the world's leading mass participation event sports photography company, operating since 1999 and now serving 70 countries.

**Quick Links:**
- Home
- Recent Events
- Media Releases
- FAQ
- Contact
- My Order
- Privacy Policy
- Terms and Conditions
- Competition Terms and Conditions
- Refund and Replacement

**Social Media:**
- Facebook icon and link
- Instagram icon and link

**Accessibility & Copyright:**
- WCAG 2.2 Level A conformance badge
- Copyright © 2026 | Marathon-Photos.com Limited

### Home Page

**Search Area:**
Users can search for event names with real-time search results displayed below the input field (results display text only, no images).

**Badge/Statistics Section:**
- **Heading:** "Get your event LIVE with us!"
- **Subheading:** "Marathon Photos Live is world leading in event sports photography."

**Statistics Badges:**
- 🌍 70 - Operating in 70 Countries
- 📷 200 - Over 200 Million Images
- 🏃 30 - Over 30 Million Athletes
- 🎯 8 - Over 8 Thousand Events

### Event / Competition Page

**API Endpoint:**
`https://api.marathon-photos.com/website_api/v7/details?event=Sports/2025/Athens%20Marathon%20The%20Authentic&bib=1234`

**Example Data:** See `data/photos.json`

**Page Header:**
- Title format: "Date, Location, Event Name"

**Search Area:**
- Search by bib number
- Search by uploading a face photo

**Search Results:**
- "Buy all photos" button displaying the price in the event's currency
- Congratulations message with athlete name: "Congratulations [Name]! We've found [count] photos of you"

**Photos Tab:**
- Photos displayed in a masonry layout, sorted by offset
- Clicking a photo opens a modal with:
  - Full-size photo display
  - "Report this is not me" button
  - Previous/Next navigation
  - Photo ID display
- **Digital Download Options:**
  - Single Photo - €12.95 (example price, varies by currency)
  - All Event Photos - €29.95
  - Photos Plus - €34.95
  - Your Photo Pack - €39.95
  - Video - €12.95

**Certificate Tab:**
- Certificate preview and download functionality
- Click to open full-size preview in modal

**Previous Year Tab:**
- Displays related events from `frontend_settings.related_events`

### Recent Events Page

**Page Header:**
- Title: "Recent Events"
- Description: "Marathon Photos Live is the world's leading mass participation event sports photography company operating since 1999, now in 70 countries"

**API Endpoint:**
`https://api.marathon-photos.com/website_api/v7/search?group=Sports&limit=20&upcoming=0`

**Example Data:** See `data/events.json`

**Event Image URL Pattern:**
`https://d2ewvgihbopi1g.cloudfront.net/photos/{event}/logo.gif`

**Display Logic:**
- Events are grouped by date
- All events on the same date are displayed together
- Dates are ordered from newest to oldest (descending)
- Display `display_name.en` when available; otherwise, show the first available language in `display_name`
- Display country flag/icon for each event
- Clicking an event navigates to the event detail page

### Contact Page

**Call-to-Action Sections:**
- "Event Organisers" → Link to "Register Your Event with Us!" (navigates to organisers page)
- "Are you a Photographer?" → Link to "Register With us" (navigates to photographer page)

**Contact Form:**
- Your Name
- Email address
- Event name (with search functionality)
- Bib number (if known)
- Order Number
- Message

### Event Organisers Page

**Page Title:** "Contact Us"

**Registration Form:**
- Your Name
- Email address
- Event name (with event search input)
- Bib number (if known)
- Order Number
- Message

### Photographer Registration Page

**Call-to-Action:**
"Apply now as a freelance photographer at Marathon Photos."

**Information Section:**
"Why Register with Marathon Photos?"

By registering, you'll enable our photographic partners to reach out to you when opportunities arise in your area. Whenever we have an event in your region that needs coverage, we'll notify registered photographers with details about the location, event date, and payment rate.

**Registration Form:**
- First Name
- Last Name
- Email address