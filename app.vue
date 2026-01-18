<template>
  <UApp :toaster="toasterConfig">
    <NuxtLayout>
      <NuxtPage />
      <NuxtRouteAnnouncer />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

// Use toaster config from app.config.ts
const toasterConfig = computed(() => appConfig.toaster || {
  position: 'top-right' as const,
  duration: 3000,
  max: 5,
  expand: true
})
  
useHead({
  title: 'Marathon Photos Live | Gold Coast Marathon',
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/img/icons/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/img/icons/favicon-16x16.png'
    }
  ]
})
</script>
