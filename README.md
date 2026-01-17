This is a website rebuild version from https://marathonphotos.live/, this is a website for Athletes (the primary users), who search for and purchase photos; Event organisers, who register events; and Photographers, who provide their contact details.

At the main features and user flow. 

#### From what I can see, the core functionality includes:

Home Page – Athletes use the search input to navigate to a specific event.

Event / Competition Page – Athletes search for their photos using their bib number and add selected photos to the cart. There is also an option to upload a face image to find photos.

Cart & Checkout – Users can place orders in the same currency and proceed to payment via a third-party payment provider.

Registration Pages – Event organisers can register events, and photographers can provide their contact information.

Supporting Pages – Recent Events, Media Releases, and FAQ.

The site also provides multi-language support, which is a strong feature, especially for international events.

#### What I would change

Improve the search experience for athletes
The search input currently feels a bit inconsistent. For example, when characters are added or removed, there doesn’t always appear to be a backend request, and the feedback when a search fails could be clearer. Improving responsiveness and error messaging could make the experience smoother, especially for first-time users.

Refine the photo search method selection
The face image upload feature is interesting, but from an athlete’s perspective, it may not be obvious or easy to use in its current position. If the goal is to help users find photos within a specific event, I would consider placing the face search option more prominently alongside the bib number search, perhaps using a simple toggle or switch to choose the search method.

#### mainly API provide
Use status to judge the request status. ok and error, or other status.
1. Get the sports events, q is the search keyword: https://api.marathon-photos.com/website_api/v7/search?group=Sports&q=marathon&limit=100
  When user search, status ok is there are data, use the result, the show name is: Month Abbreviations Year: display_name.en
  ```JSON
  {"status": "ok", "result": [{"country": "US", "live": 0, "display_name": {"en": "DONNA Marathon Weekend - Sunday"}, "event": "Sports/MPUS/2026/DONNA Marathon Weekend - Sunday", "eventid": "10880", "date": "2026-02-01"}}
  ```
  There isn't any data;
  ```JSON
  {"status": "ok", "result": []}
  ```
  There are some error when user input.
  ```JSON
  {"status": "error", "reason": "Exception: Please enter part of event name. handling search"}
  ```

#### Techstacks
We need using nuxt.js, because we need handle the API CORS and SSR, we will using vue 3, and nuxt ui also.

#### Pages:
Header and Footer for every page:
Header: Home, CART, CONTACT, RECENT EVENTS. 
Action in header: Change the language, English, DEUTSCH, CZECH, 简体中文.

Footer:
About us
Marathon Photos Live is the world's leading mass participation event sports photography company operating since 1999, now in 70 countries

Quick Links
Home
Recent Events
Media Releases
FAQ
Contact
My Order
Privacy Policy
Terms and Conditions
Competition Terms and Conditions
Refund and Replacement

Facebook: [url(../img/fb-min.863eddaa.webp) no-repeat 0 0/cover](https://marathonphotos.live/img/fb-min.863eddaa.webp) - Rendered aspect ratio:	494∶329

<img height="32" width="88" src="https://www.w3.org/WAI/WCAG22/wcag2.2A-blue" alt="Level A conformance,
                    W3C WAI Web Content Accessibility Guidelines 2.2">
Copyright © 2026 | Marathon-Photos.com Limited

Facebook Icon, Instagram Icon

Home Page:
Search Area: Search the event name, and have the associate content below the search. content no image.
Badge Area: 
Get your event LIVE with us!
Marathon Photos Live is world leading in event sports photography.

https://marathonphotos.live/img/globe.4d188807.svg
70
Operating in 70 Countries

https://marathonphotos.live/img/camera.c6816ed2.svg
200
Over 200 Million Images

https://marathonphotos.live/img/Athletes_2.dce95e88.svg
30
Over 30 Million Athletes

https://marathonphotos.live/img/Events.a01b4893.svg
8
Over 8 Thousand Events

Event/Competition Page:
Get the athletes photos from bib number: https://api.marathon-photos.com/website_api/v7/details?event=Sports/2025/Athens%20Marathon%20The%20Authentic&bib=1234 , the example data can be read by: data/photos.json

Title: Date, location, Event name
Search Area: by bib number, by upload photos

Search Result: 
A button: Buy all photos: ($ current currency depend on event location) price
Congratulations Stefano!We've found
108 
photos of you

Photos Tab:
All photos display by offset, use Masonry Layouts
Click the photo have a pop up to show: the current photo, button to report this is not me
Digital download options: Single Photo
€12.95
All Event Photos
€29.95
Photos Plus
€34.95
Your Photo Pack
€39.95
Video
€12.95

Certificate Tab: One Certificate page can download, preview, and open a pop up to show the big picture.
Previous Year:frontend_settings.related_events

Recent Events Page:
Recent Events.

Marathon Photos Live is the world's leading mass participation event sports photography company operating since 1999, now in 70 countries

API: https://api.marathon-photos.com/website_api/v7/search?group=Sports&limit=20&upcoming=0
API data example: data/events.json
Event image: https://d2ewvgihbopi1g.cloudfront.net/photos/{event}/logo.gif
We show the events group by the date, all the event on one date show together. and order date from bigger to smaller.
show the display_name.en first, if no en attrs, we find what exists in display_name and show it
and we need show the country icon.


Event Organisers:
Contact Us.
Your Name
Email address
Event name: input searche vents
Bib number (if known)
Order Number
Message

Race photographers page:
Apply now as a freelance photographer at Marathon Photos.
Why Register with Marathon Photos?
By registering, you'll enable our photographic partners to reach out to you when opportunities arise in your area. Whenever we have an event in your region that needs coverage, we'll notify registered photographers with details about the location, event date, and payment rate.

Your Contact Details
First Name
Last Name
Email address