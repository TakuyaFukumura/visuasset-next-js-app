/**
 * parseMonthlyAssets のテスト
 */

import fs from 'fs';
import path from 'path';

// テスト用CSVの内容
const sampleCsv = `year,month,stocks,cash,crypto
2024,1,750,150,35
2024,3,770,150,37
2025,6,880,150,40
`;

describe('parseMonthlyAssets', () => {
    const testDataDir = path.join(__dirname, 'test-data-monthly');
    const testCsvPath = path.join(testDataDir, 'assets_monthly.csv');

    beforeEach(() => {
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, {recursive: true});
        }
        fs.writeFileSync(testCsvPath, sampleCsv, 'utf-8');
        jest.resetModules();
    });

    afterEach(() => {
        fs.rmSync(testDataDir, {recursive: true, force: true});
    });

    // pathモジュールのjoinのみモック
    jest.mock('path', () => ({
        ...jest.requireActual('path'),
        join: (...args: string[]): string => {
            if (args[1] === 'data' && args[2] === 'assets_monthly.csv') {
                return path.join(__dirname, 'test-data-monthly', 'assets_monthly.csv');
            }
            return jest.requireActual('path').join(...args);
        },
    }));

    it('CSVを正しくパースして返す', async () => {
        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        const data = parseMonthlyAssets();

        expect(data).toHaveLength(3);
        expect(data[0]).toEqual({year: 2024, month: 1, stocks: 750, cash: 150, crypto: 35});
        expect(data[1]).toEqual({year: 2024, month: 3, stocks: 770, cash: 150, crypto: 37});
        expect(data[2]).toEqual({year: 2025, month: 6, stocks: 880, cash: 150, crypto: 40});
    });

    it('年月昇順でソートされている', async () => {
        const reversedCsv = `year,month,stocks,cash,crypto
2025,6,880,150,40
2024,1,750,150,35
2024,3,770,150,37
`;
        fs.writeFileSync(testCsvPath, reversedCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        const data = parseMonthlyAssets();

        expect(data[0]).toMatchObject({year: 2024, month: 1});
        expect(data[1]).toMatchObject({year: 2024, month: 3});
        expect(data[2]).toMatchObject({year: 2025, month: 6});
    });

    it('ヘッダーが不正な場合は例外を投げる', async () => {
        const invalidHeaderCsv = `year,month,stocks,cash,invalid
2024,1,750,150,35
`;
        fs.writeFileSync(testCsvPath, invalidHeaderCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Invalid header in assets_monthly.csv');
    });

    it('カラム数が不足している行は例外を投げる', async () => {
        const invalidColumnsCsv = `year,month,stocks,cash,crypto
2024,1,750,150
`;
        fs.writeFileSync(testCsvPath, invalidColumnsCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Invalid column count in assets_monthly.csv at line 2');
    });

    it('数値以外の値が含まれている行は例外を投げる', async () => {
        const invalidValueCsv = `year,month,stocks,cash,crypto
2024,1,abc,150,35
`;
        fs.writeFileSync(testCsvPath, invalidValueCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Non-numeric value found in assets_monthly.csv at line 2');
    });

    it('monthが範囲外（0）の場合は例外を投げる', async () => {
        const invalidMonthCsv = `year,month,stocks,cash,crypto
2024,0,750,150,35
`;
        fs.writeFileSync(testCsvPath, invalidMonthCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Invalid month value in assets_monthly.csv at line 2');
    });

    it('monthが範囲外（13）の場合は例外を投げる', async () => {
        const invalidMonthCsv = `year,month,stocks,cash,crypto
2024,13,750,150,35
`;
        fs.writeFileSync(testCsvPath, invalidMonthCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Invalid month value in assets_monthly.csv at line 2');
    });

    it('yearが0以下の場合は例外を投げる', async () => {
        const invalidYearCsv = `year,month,stocks,cash,crypto
0,1,750,150,35
`;
        fs.writeFileSync(testCsvPath, invalidYearCsv, 'utf-8');

        const {parseMonthlyAssets} = await import('../../lib/parseMonthlyAssets');
        expect(() => parseMonthlyAssets()).toThrow('Invalid year value in assets_monthly.csv at line 2');
    });
});
