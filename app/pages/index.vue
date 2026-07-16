<script setup lang="ts">
import type { DevicesResponse } from '#shared/types'

import './index.css'

const route = useRoute()
const { brand, minPrice, maxPrice } = useDeviceFilters()

const { data, status, error, refresh } = await useFetch<DevicesResponse>('/api/devices', {
  query: computed(() => route.query),
})

const items = computed(() => data.value?.items ?? [])
const isLoading = computed(() => status.value === 'pending')
const isEmpty = computed(() => !isLoading.value && !error.value && items.value.length === 0)

useSeoMeta({
  title: 'Device Catalog',
  description: 'Browse smartphones, wearables and accessories. Filter by brand and price.',
})
</script>

<template>
  <div class="listing">
    <div class="listing_head">
      <h1 class="listing_title">Device Catalog</h1>
      <p class="listing_subtitle">Smartphones, wearables &amp; accessories</p>
    </div>

    <div class="listing_layout">
      <aside class="listing_sidebar">
        <FilterPanel
          v-model:brand="brand"
          v-model:min-price="minPrice"
          v-model:max-price="maxPrice"

          :available-brands="data?.brands ?? []"

        />
      </aside>


    </div>
  </div>
</template>