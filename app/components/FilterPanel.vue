<script setup lang="ts">

    import { type SortOption } from '#shared/types';
import './FilterPanel.css';
    
    interface Props {
        availableBrands: string[]
        priceRange: { min: number; max: number }
        resultCount: number
    }
    defineProps<Props>()


    const brand = defineModel<string | undefined>('brand')
    const minPrice = defineModel<number | undefined>('minPrice')
    const maxPrice = defineModel<number | undefined>('maxPrice')
    const sort = defineModel<SortOption | undefined>('sort')

    const sortLabels: Record<SortOption, string> = {
       'price-asc': 'Price: low to high',
        'price-desc': 'Price: high to low',
    };

    function reset() {
        brand.value = undefined
        minPrice.value = undefined
        maxPrice.value = undefined
        sort.value = undefined
    };

    const hasActiveFilters = computed(() =>
        brand.value !== undefined ||
        minPrice.value !== undefined ||
        maxPrice.value !== undefined ||
        sort.value !== undefined,
    );


</script>