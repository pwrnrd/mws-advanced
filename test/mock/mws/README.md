# XML Test Folder Structure

This folder contains all the XML test files provided by Amazon's API clients. The XML files are grouped into folders by API endpoint. In addition, each folder might contain special test cases. These special cases can be found in the sub-folder "special-cases" inside the folder which holds the XML files provided by Amazon's API clients. Special cases are created by endpoint. Therefore, the 'special-cases'-folder contain sub-folders by endpoint. A file path look as follows: './[API]/[special-cases]/[endpoint]/[testfile.xml]'.

**Example**
./Products/special-cases/GetMatchingProductForId/singe-product-response.xml

The special test case XML files stored in the sub-folder 'special-cases' are cases created by the creators of this package to test cases not covered by the XML test files provided by Amazon's API clients.

## Updates

When Amazon's API changes, the XML files need to be updated.

### Amazon Provided XML Files

To update the XML files stored in a specific subdirectory, simple download Amazon's latest API client (e.g. the Java client). Find the XML files provided by Amazon in the 'Mock' directory. Copy these files to the directory which you want to update. Overwrite all existing files. If a new file is added or a name has changed, change the tests to find the (renamed) files.

### Special test cases

Changes in Amazon provided XML files (and thus the MWS API) should manually be replicated in the special test cases. Open the special test cases and make adjustments accordingly.
