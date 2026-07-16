<script setup lang="ts">

import './index.css'

const route = useRoute()


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