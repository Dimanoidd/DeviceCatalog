<script setup lang="ts">
    
    interface Props {
        availableBrands: string[]

    }
    defineProps<Props>()


    const brand = defineModel<string | undefined>('brand')
    const minPrice = defineModel<number | undefined>('minPrice')
    const maxPrice = defineModel<number | undefined>('maxPrice')
</script>