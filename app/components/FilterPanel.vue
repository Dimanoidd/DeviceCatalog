<script setup lang="ts">

    import { sortOptions, type SortOption } from '#shared/types';
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

<template>
    <form class="filter_panel" role="search" aria-label="Filter devices" @submit.prevent>
        <fieldset class="filter_panel_group">
            <legend class="filter_panel_legend">Brand</legend>
            <label class="visually_hidden" for="filter-brand">Brand</label>
            <select id="filter-brand" v-model="brand" class="filter_panel_control">
                <option :value="undefined">All brands</option>
                <option v-for="brandName in availableBrands" :key="brandName" :value="brandName">{{ brandName }}</option>
            </select>
        </fieldset>

        <fieldset class="filter_panel_group">
            <legend class="filter_panel_legend">Price, MDL</legend>
            <div class="filter_panel_range">
                <label class="visually_hidden" for="filter-min">Minimum price</label>
                <input id="filter-min"
                    v-model.number.lazy="minPrice"
                    class="filter_panel_control"
                    type="number"
                    inputmode="numeric"
                    :min="priceRange.min"
                    :max="priceRange.max"
                    :placeholder="String(priceRange.min)"
                />
                <span aria-hidden="true">—</span>
                <label class="visually_hidden" for="filter-max">Maximum price</label>
                <input id="filter-max"
                    v-model.number.lazy="maxPrice"
                    class="filter_panel_control"
                    type="number"
                    inputmode="numeric"
                    :min="priceRange.min"
                    :max="priceRange.max"
                    :placeholder="String(priceRange.max)"
                />
            </div>
        </fieldset>

        <fieldset class="filter_panel_group">
            <legend class="filter_panel_legend">Sort</legend>
            <label class="visually_hidden" for="filter-sort">Sort by</label>
            <select id="filter-sort" v-model="sort" class="filter_panel_control">
                <option :value="undefined">Default</option>
                <option v-for="sortOption in sortOptions" :key="sortOption" :value="sortOption">{{ sortLabels[sortOption] }}</option>
            </select>
        </fieldset>

        <div class="filter_panel_footer">
        <output class="filter_panel_count">{{ resultCount }} result{{ resultCount === 1 ? '' : 's' }}</output>
            <button  v-if="hasActiveFilters"  type="button" class="filter_panel_reset" @click="reset">Reset filters</button>
        </div>
    </form>
</template>