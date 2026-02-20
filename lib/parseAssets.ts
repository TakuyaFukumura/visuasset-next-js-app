import fs from 'fs';
import path from 'path';

export interface AssetData {
    year: number;
    stocks: number;
    cash: number;
    crypto: number;
}

/**
 * data/assets.csv を読み込んで資産データを返す
 */
export function parseAssets(): AssetData[] {
    const filePath = path.join(process.cwd(), 'data', 'assets.csv');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    // 1行目はヘッダーのためスキップ
    return lines
        .slice(1)
        .map((line) => {
            const [year, stocks, cash, crypto] = line.split(',').map(Number);
            return {year, stocks, cash, crypto};
        })
        .sort((a, b) => a.year - b.year);
}
