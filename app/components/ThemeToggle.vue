<script setup lang="ts">
    import './ThemeToggle.css';

    const { theme, toggle } = useTheme()

    const isDark = computed(() => theme.value === 'dark')
    const label = computed(() => (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'))
</script>

<template>
  <button
    type="button"
    class="theme_toggle"
    :aria-pressed="isDark"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <span aria-hidden="true">{{ isDark ? '🌙' : '☀️' }}</span>
  </button>
</template>