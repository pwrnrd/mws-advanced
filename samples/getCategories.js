const mws = require('..');
const keys = require('../test/keys.json');

mws.init(keys);

async function main() {
    const results = await mws.getProductCategoriesForASINs({
        marketplaceId: 'ATVPDKIKX0DER',
        asins: [
            'B00IDD9TU8',
            'B00IH00CN0',
        ],
    });
    console.warn(JSON.stringify(results, null, 4));
}

main();
