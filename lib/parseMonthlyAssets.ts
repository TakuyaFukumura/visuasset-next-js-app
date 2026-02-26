import fs from 'fs';
import path from 'path';

export interface MonthlyAssetData {
    year: number;
    month: number;
    stocks: number;
    cash: number;
    crypto: number;
}

/**
 * data/assets_monthly.csv を読み込んで月次資産データを返す
 */
export function parseMonthlyAssets(): MonthlyAssetData[] {
    const filePath = path.join(process.cwd(), 'data', 'assets_monthly.csv');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');

    if (lines.length === 0) {
        throw new Error('assets_monthly.csv is empty');
    }

    // ヘッダー検証
    const header = lines[0].split(',').map((h) => h.trim());
    const expectedHeader = ['year', 'month', 'stocks', 'cash', 'crypto'];
    const isHeaderValid =
        header.length === expectedHeader.length &&
        header.every((h, idx) => h === expectedHeader[idx]);

    if (!isHeaderValid) {
        throw new Error(
            `Invalid header in assets_monthly.csv. Expected "${expectedHeader.join(',')}", but got "${header.join(',')}".`
        );
    }

    // 2行目以降をデータとしてパース
    const data: MonthlyAssetData[] = [];

    lines.slice(1).forEach((line, index) => {
        const lineNumber = index + 2; // 1行目がヘッダーのため +2
        const rawColumns = line.split(',');

        if (rawColumns.length !== expectedHeader.length) {
            throw new Error(
                `Invalid column count in assets_monthly.csv at line ${lineNumber}. ` +
                `Expected ${expectedHeader.length} columns, but got ${rawColumns.length}.`
            );
        }

        const [yearStr, monthStr, stocksStr, cashStr, cryptoStr] = rawColumns.map((v) => v.trim());

        const year = Number(yearStr);
        const month = Number(monthStr);
        const stocks = Number(stocksStr);
        const cash = Number(cashStr);
        const crypto = Number(cryptoStr);

        if (
            !Number.isFinite(year) ||
            !Number.isFinite(month) ||
            !Number.isFinite(stocks) ||
            !Number.isFinite(cash) ||
            !Number.isFinite(crypto)
        ) {
            throw new Error(
                `Non-numeric value found in assets_monthly.csv at line ${lineNumber}: "${line}".`
            );
        }

        if (!Number.isInteger(year) || year <= 0) {
            throw new Error(
                `Invalid year value in assets_monthly.csv at line ${lineNumber}: "${yearStr}". Year must be a positive integer.`
            );
        }

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            throw new Error(
                `Invalid month value in assets_monthly.csv at line ${lineNumber}: "${monthStr}". Month must be an integer between 1 and 12.`
            );
        }

        data.push({year, month, stocks, cash, crypto});
    });

    return data.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
}
