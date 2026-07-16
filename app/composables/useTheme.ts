export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function useTheme() {
    const theme = useState<Theme>('theme', () => 'light');

    onMounted(() => {
        const current = document.documentElement.dataset.theme as Theme | undefined
        if (current) theme.value = current
    });

    // On the client, adopt whatever the pre-paint script already decided.
    function apply(next: Theme) {
        theme.value = next
        if (import.meta.client) {
            document.documentElement.dataset.theme = next
            localStorage.setItem(STORAGE_KEY, next);
        }
    }

    function toggle() {
        apply(theme.value === 'dark' ? 'light' : 'dark');
    }

    return { theme, toggle, setTheme: apply }
}