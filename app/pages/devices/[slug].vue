<script setup lang="ts">
import type { Device } from '#shared/types'
import './slug.css'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: device, error } = await useFetch<Device>(
  () => `/api/devices/${slug.value}`,
)

// Propagate a real 404 to crawlers (not a 200 "not found" page).
if (error.value && import.meta.server) {
  setResponseStatus(useRequestEvent()!, 404)
}


if (device.value) {
  const currentDevice = device.value
  useSeoMeta({
    title: `${currentDevice.brand} ${currentDevice.model}`,
    description: `${currentDevice.brand} ${currentDevice.model} — ${formatMdl(currentDevice.priceMDL)}. ${Object.values(currentDevice.specs).join(' · ')}.`,
    ogTitle: `${currentDevice.brand} ${currentDevice.model}`,
    ogDescription: `${formatMdl(currentDevice.priceMDL)} · ${currentDevice.category}`,
    ogType: 'website',
    ogImage: currentDevice.image,
  })
}

const specLabels: Record<string, string> = {
  display: 'Display',
  storage: 'Storage',
  battery: 'Battery',
  type: 'Type',
  anc: 'Noise cancelling',
}

const discount = computed(() =>
  device.value ? discountPercent(device.value.priceMDL, device.value.oldPriceMDL) : null,
)
const imageFailed = ref(false)
</script>

<template>
  <!-- NOT FOUND -->
  <div v-if="error" class="detail_missing">
    <p class="detail_missing_code">404</p>
    <h1 class="detail_missing_title">Device not found</h1>
    <p class="detail_missing_text">
      We couldn't find a device with id “{{ slug }}”.
    </p>
    <NuxtLink to="/" class="detail_missing_link">← Back to catalog</NuxtLink>
  </div>

  <!-- DEVICE -->
  <article v-else-if="device" class="detail">
    <nav class="detail_crumbs" aria-label="Breadcrumb">
      <NuxtLink to="/">Catalog</NuxtLink>
      <span aria-hidden="true">/</span>
      <span>{{ device.brand }} {{ device.model }}</span>
    </nav>

    <div class="detail_layout">
      <div class="detail_media">
        <img
          v-if="!imageFailed"
          class="detail_img"
          :src="device.image"
          :alt="`${device.brand} ${device.model}`"
          width="600"
          height="450"
          @error="imageFailed = true"
        />
        <div
          v-else
          class="detail_placeholder"
          role="img"
          :aria-label="`${device.brand} ${device.model}`"
        >
          <span aria-hidden="true">{{ device.brand.charAt(0) }}</span>
        </div>
      </div>

      <div class="detail_info">
        <p class="detail_brand">{{ device.brand }}</p>
        <h1 class="detail_title">{{ device.model }}</h1>

        <div class="detail_prices">
          <span class="detail_price">{{ formatMdl(device.priceMDL) }}</span>
          <template v-if="discount !== null">
            <span class="detail_old">{{ formatMdl(device.oldPriceMDL!) }}</span>
            <span class="detail_discount">−{{ discount }}%</span>
          </template>
        </div>

        <p class="detail_stock" :data-in-stock="device.inStock">
          {{ device.inStock ? 'In stock' : 'Out of stock' }}
        </p>

        <dl class="detail_specs">
          <div v-for="(value, key) in device.specs" :key="key" class="detail_spec">
            <dt>{{ specLabels[key] ?? key }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </article>
</template>
