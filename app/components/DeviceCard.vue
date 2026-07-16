<script setup lang="ts">
    import type { Device } from '#shared/types'
import './DeviceCard.css'

    interface Props {
        device: Device
        headingLevel?: 2 | 3 | 4
        to?: string | null
    };

    const props = withDefaults(defineProps<Props>(), {
        headingLevel: 3,
        to: null,
    });


    const headingTag = computed(() => `h${props.headingLevel}` as const)
    const discount = computed(() => discountPercent(props.device.priceMDL, props.device.oldPriceMDL))
    const imageFailed = ref(false)


    const badgeLabel: Record<NonNullable<Device['badge']>, string> = {
        top: 'Top',
        new: 'New',
        sale: 'Sale',
    };
</script>

<template>
  <article
    class="device_card"
    :class="{ 'device_card_out': !device.inStock }"
  >
    <div class="device_card_media">
      <slot name="media">
        <img
          v-if="!imageFailed"
          class="device_card_img"
          :src="device.image"
          :alt="`${device.brand} ${device.model}`"
          loading="lazy"
          decoding="async"
          width="400"
          height="300"
          @error="imageFailed = true"
        />
        <div v-else class="device_card_placeholder" role="img" :aria-label="`${device.brand} ${device.model}`">
          <span aria-hidden="true">{{ device.brand.charAt(0) }}</span>
        </div>
      </slot>

      <span v-if="device.badge" class="device_card_badge" :data-badge="device.badge">
        {{ badgeLabel[device.badge] }}
      </span>

      <span v-if="!device.inStock" class="device_card_stock">Out of stock</span>
    </div>

    <div class="device_card_body">
      <p class="device_card_brand">{{ device.brand }}</p>

      <component :is="headingTag" class="device_card_title">
        <NuxtLink v-if="to" :to="to" class="device_card_link">{{ device.model }}</NuxtLink>
        <template v-else>{{ device.model }}</template>
      </component>

      <div class="device_card_prices">
        <span class="device_card_price">{{ formatMdl(device.priceMDL) }}</span>
        <template v-if="discount !== null">
          <span class="device_card_old">{{ formatMdl(device.oldPriceMDL!) }}</span>
          <span class="device_card_discount">−{{ discount }}%</span>
        </template>
      </div>

      <div v-if="$slots.actions" class="device_card_actions">
        <slot name="actions" :device="device" />
      </div>
    </div>
  </article>
</template>