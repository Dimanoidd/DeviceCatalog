<script setup lang="ts">
import type { DevicesResponse } from '#shared/types'

import './index.css'

const route = useRoute()
const { brand, minPrice, maxPrice, sort } = useDeviceFilters()

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
            v-model:sort="sort"
            :available-brands="data?.brands ?? []"
            :price-range="data?.priceBounds ?? { min: 0, max: 0 }"
            :result-count="items.length"

        />
      </aside>

        <section class="listing_results" aria-live="polite" :aria-busy="isLoading">

            <div v-if="error" class="listing_state" role="alert">
                
            </div>

            <ul v-else-if="isLoading" class="listing_grid" aria-hidden="true">
                <li v-for="index in 6" :key="index" class="listing_skeleton" />
            </ul>

            <ul v-else class="listing_grid">
                <li v-for="device in items" :key="device.id">
                    <DeviceCard :device="device" :to="`/device/${device.slug}`" :heading-level="2" />
                </li>
            </ul>
            
        </section>

    </div>
  </div>
</template>