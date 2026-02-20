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

    if (lines.length === 0) {
        throw new Error('assets.csv is empty');
    }

    // ヘッダー検証
    const header = lines[0].split(',').map((h) => h.trim());
    const expectedHeader = ['year', 'stocks', 'cash', 'crypto'];
    const isHeaderValid =
        header.length === expectedHeader.length &&
        header.every((h, idx) => h === expectedHeader[idx]);

    if (!isHeaderValid) {
        throw new Error(
            `Invalid header in assets.csv. Expected "${expectedHeader.join(',')}", but got "${header.join(',')}".`
        );
    }

    // 2行目以降をデータとしてパース
    const data: AssetData[] = [];

    lines.slice(1).forEach((line, index) => {
        const lineNumber = index + 2; // 1行目がヘッダーのため +2
        const rawColumns = line.split(',');

        if (rawColumns.length !== expectedHeader.length) {
            throw new Error(
                `Invalid column count in assets.csv at line ${lineNumber}. ` +
                `Expected ${expectedHeader.length} columns, but got ${rawColumns.length}.`
            );
        }

        const [yearStr, stocksStr, cashStr, cryptoStr] = rawColumns.map((v) => v.trim());

        const year = Number(yearStr);
        const stocks = Number(stocksStr);
        const cash = Number(cashStr);
        const crypto = Number(cryptoStr);

        if (
            !Number.isFinite(year) ||
            !Number.isFinite(stocks) ||
            !Number.isFinite(cash) ||
            !Number.isFinite(crypto)
        ) {
            throw new Error(
                `Non-numeric value found in assets.csv at line ${lineNumber}: "${line}".`
            );
        }

        data.push({year, stocks, cash, crypto});
    });

    return data.sort((a, b) => a.year - b.year);
}
