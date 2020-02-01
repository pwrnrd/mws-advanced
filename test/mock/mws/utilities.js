/* eslint-disable no-use-before-define */
const sinon = require('sinon');
const MWS = require('@ericblade/mws-simple').default;
const fs = require('fs');
const { promisify } = require('util');
const { parseStringPromise: xmlParser } = require('xml2js');

const readFile = promisify(fs.readFile);

/**
 * Stub mws.requests with an XML file.
 * To create a stub:
 * @example
 * describe('API', function runAPITests() {
 *  let stubbed;
 *  beforeEach(() => {
 *    stubbed = sinon.stub(MWS.prototype, 'request');
 *    MWSAdvanced.init(MWSAPIKeys);
 *  });
 *  it('Can stub', async function () {
 *    stubbedXMLResultFile(stubbed, './test/mock/mws/Sellers/ListMarketplaceParticipationsResponse.xml');
 *    const result = await MWSAdvanced.getMarketplaces();
 *    expect(result).to.deep.equal({
 *      string: {
 *        marketplaceId: 'String',
 *        name: 'String',
 *        defaultCountryCode: 'String',
 *        defaultCurrencyCode: 'String',
 *        defaultLanguageCode: 'String',
 *        domainName: 'String',
 *        sellerId: 'String',
 *        hasSellerSuspendedListings: 'String',
 *      },
 *    });
 *  });
 * });
 *
 * @param {*} stub a stubbed instance of MWS-Simple
 * @param {Array<string> | string} pathToXMLFile array of path to Amazon response XML file, in order in which you want to request those files or a simple string if you want all subsequent requests to be handled in the same way.
 * @param {*} headers the headers to return
 * @returns a sinon stub
 */
async function stubbedXMLResultFile(stub, pathToXMLFile, headers = {}) {
    if (!Array.isArray(pathToXMLFile)) {
        const fakeReturn = createFakeReturn(pathToXMLFile, headers);
        return stub.returns(fakeReturn);
    }
    const stubWithDifferentOnCalls = await createStubForDifferentCalls(stub, pathToXMLFile, headers);
    return stubWithDifferentOnCalls;
}

/**
 * Create a fake return object
 * @returns a promise containing an object which holds fake headers and a fake result in the form of the XML file(s)
 */
async function createFakeReturn(pathToXMLFile, headers) {
    const file = await getXMLFile(pathToXMLFile);
    return {
        headers,
        result: file,
    };
}
async function getXMLFile(pathToXMLFile) {
    const mockedResponse = await readFile(pathToXMLFile, 'utf8');
    const parsedXML = await xmlParser(mockedResponse);
    return parsedXML;
}

/**
 * Creates sinon stubs that handle a call differently depending on the
 * number of times the stub is called.
 * @param {Array<string>} pathToXMLFiles
 */
function createStubForDifferentCalls(stub, pathToXMLFiles, headers) {
    return pathToXMLFiles.reduce((theStub, path, index) => {
        const fakeReturn = createFakeReturn(path, headers);
        return theStub.onCall(index).returns(fakeReturn);
    }, stub);
}

function stubMWSSimple() {
    return sinon.stub(MWS.prototype, 'request');
}


module.exports = {
    stubbedXMLResultFile,
    stubMWSSimple,
};
