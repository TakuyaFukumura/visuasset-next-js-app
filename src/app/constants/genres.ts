export type GenreKey = 'stocks' | 'cash' | 'crypto';

export const GENRE_COLORS: Record<GenreKey, string> = {
    stocks: '#3b82f6',
    cash: '#22c55e',
    crypto: '#f59e0b',
};

export const GENRE_NAMES: Record<GenreKey, string> = {
    stocks: '株式',
    cash: '現預金',
    crypto: '暗号資産',
};
