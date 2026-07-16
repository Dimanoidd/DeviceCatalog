import { sortOptions, type SortOption } from '#shared/types';


export function useDeviceFilters() {

    const route = useRoute();
    const router = useRouter();

    function patchQuery(patch: Record<string, string | undefined>) {
        const query: Record<string, string> = {}
        // keep existing params...
        for (const [key, value] of Object.entries(route.query)) {
            if (typeof value === 'string') query[key] = value  
        }
        // ...then apply the patch, dropping empties so the URL stays clean.
        for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === '') delete query[key]
            else query[key] = value
        }


        router.replace({ query })
    };

    function numberFromQuery(rawValue: unknown): number | undefined {
        if (typeof rawValue !== 'string' || rawValue === '') return undefined;
        const parsed = Number(rawValue)
        return Number.isFinite(parsed) ? parsed : undefined
    };



    const brand = computed<string | undefined>({
        get: () => (typeof route.query.brand === 'string' ? route.query.brand : undefined),
        set: (value) => patchQuery({ brand: value }),
    })

    const minPrice = computed<number | undefined>({
        get: () => numberFromQuery(route.query.minPrice),
        set: (value) =>
        patchQuery({ minPrice: value == null || Number.isNaN(value) ? undefined : String(value) }),
    })

    const maxPrice = computed<number | undefined>({
        get: () => numberFromQuery(route.query.maxPrice),
        set: (value) =>
        patchQuery({ maxPrice: value == null || Number.isNaN(value) ? undefined : String(value) }),
    })

    const sort = computed<SortOption | undefined>({
        get: () => {
        const rawSort = route.query.sort
        return typeof rawSort === 'string' && (sortOptions as readonly string[]).includes(rawSort)
            ? (rawSort as SortOption)
            : undefined
        },
        set: (value) => patchQuery({ sort: value }),
    })

    return { brand, minPrice, maxPrice, sort }
}