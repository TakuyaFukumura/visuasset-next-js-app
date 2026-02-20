/**
 * parseAssets のテスト
 */

import fs from 'fs';
import path from 'path';

// テスト用CSVの内容
const sampleCsv = `year,stocks,cash,crypto
2020,100,200,50
2021,150,220,80
2022,180,210,60
`;

describe('parseAssets', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const testCsvPath = path.join(testDataDir, 'assets.csv');

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
            if (args[1] === 'data' && args[2] === 'assets.csv') {
                return path.join(__dirname, 'test-data', 'assets.csv');
            }
            return jest.requireActual('path').join(...args);
        },
    }));

    it('CSVを正しくパースして返す', async () => {
        const {parseAssets} = await import('../../lib/parseAssets');
        const data = parseAssets();

        expect(data).toHaveLength(3);
        expect(data[0]).toEqual({year: 2020, stocks: 100, cash: 200, crypto: 50});
        expect(data[1]).toEqual({year: 2021, stocks: 150, cash: 220, crypto: 80});
        expect(data[2]).toEqual({year: 2022, stocks: 180, cash: 210, crypto: 60});
    });

    it('年昇順でソートされている', async () => {
        // 逆順のCSVを書き込む
        const reversedCsv = `year,stocks,cash,crypto
2022,180,210,60
2020,100,200,50
2021,150,220,80
`;
        fs.writeFileSync(testCsvPath, reversedCsv, 'utf-8');

        const {parseAssets} = await import('../../lib/parseAssets');
        const data = parseAssets();

        expect(data[0].year).toBe(2020);
        expect(data[1].year).toBe(2021);
        expect(data[2].year).toBe(2022);
    });
});
