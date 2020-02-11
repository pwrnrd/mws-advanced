const MWSAdvanced = require('..');
const { stubbedXMLResultFile, stubMWSSimple } = require('./mock/mws/utilities');

describe('Finances Parser', () => {
    describe('listFinancialEvents()', () => {
        let result;
        before(async function () {
            const stubbed = stubMWSSimple();
            MWSAdvanced.init(MWSAPIKeys);
            stubbedXMLResultFile(stubbed, './test/mock/mws/Finances/ListFinancialEventsResponse.xml');
            result = await MWSAdvanced.listFinancialEvents({ PostedAfter: new Date(0) });
        });
        it('All financial event lists to contain arrays', () => {
            const financialEventListNames = Object.keys(result);
            for (let i = 0; i < financialEventListNames.length; i += 1) {
                const financialEventListName = financialEventListNames[i];
                expect(result[financialEventListName]).to.be.an('array');
            }
        });

        it('Transforms nested elements of which the keys end with "List" to an array', () => {
            expect(result.ImagingServicesFeeEventList[0].ImagingServicesFeeEvent.FeeList).to.be.an('array');
            expect(result.SAFETReimbursementEventList[0].SAFETReimbursementEvent.SAFETReimbursementItemList).to.be.an('array');
            expect(result.AdjustmentEventList[0].AdjustmentEvent.AdjustmentItemList).to.be.an('array');
            expect(result.DebtRecoveryEventList[0].DebtRecoveryEvent.DebtRecoveryItemList).to.be.an('array');
            expect(result.DebtRecoveryEventList[0].DebtRecoveryEvent.ChargeInstrumentList).to.be.an('array');
            expect(result.ShipmentEventList[0].ShipmentEvent.ShipmentItemList[0].ShipmentItem.ItemTaxWithheldList).to.be.an('array');
        });

        it('Transforms lists of which keys that do not end with "List" but which should be lists', () => {
            expect(result.ShipmentEventList[0].ShipmentEvent.ShipmentItemList[0].ShipmentItem.ItemTaxWithheldList[0].TaxWithheldComponent.TaxesWithheld).to.be.an('array');
        });
    });
});
