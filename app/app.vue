<script setup lang="ts">
  import './app.css';

  useSeoMeta({
    titleTemplate: (title) => (title ? `${title} · Moldcell Devices` : 'Moldcell Device Catalog'),
    ogSiteName: 'Moldcell Devices',
  })
</script>


<template>
  <div class="app">
    <header class="app_header">
      <div class="container app_header_inner">
        <NuxtLink to="/" class="app_header_brand">
          <span class="app_header_logo" aria-hidden="true">◈</span>
          <span>Moldcell <strong>Devices</strong></span>
        </NuxtLink>
        <ThemeToggle />
      </div>
    </header>

    <main class="container app_main">
      <NuxtPage />
    </main>

    <footer class="app_footer">
      <div class="container">
        <small>demo build</small>
      </div>
    </footer>

  </div>
</template>
