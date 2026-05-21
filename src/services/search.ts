export interface NaturalLanguageSearchResult {
    answer: string;
}

export const SearchService = {
    askDatabase: async (query: string): Promise<NaturalLanguageSearchResult> => {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(err.error || 'Search request failed');
        }

        return response.json();
    },
};
