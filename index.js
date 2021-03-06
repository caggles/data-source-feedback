const DataSourceFeedback = require('./data-source-feedback');
const isOnline = require('./functions/online');

/* Example

    const { DataSourceFeedback, isOnline } = require('data-source-feedback');

    const config = {
        dataCatalogUrl: 'https://catalogue.data.gov.bc.ca/api/3',
        chesApiUrl: 'https://ches-master-9f0fbe-dev.pathfinder.gov.bc.ca/api/v1',
        chesTokenUrl: 'https://sso-dev.pathfinder.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token',
        chesClientId: 'your common service client id',
        chesClientSecret: 'your common service client secret'
    };

    const dataSourceFeedback = new DataSourceFeedback(config);

    ...
    ...
    dataSourceFeedback.add('bc data catalog package name', 'this is my comment', [{some: 'geojson'}]);
    dataSourceFeedback.add('another bc data catalog package name', 'this is my comment!!!', [{some: 'geojson'},{some: 'geojson?'},{some: 'geojson!'}]);

   // when online...
   dataSourceFeedback.send('your currently logged in user email address');

   // or just use online to check
  (async () => {
      console.log(await isOnline());
      dataSourceFeedback.send('your currently logged in user email address');
  })();

 */

module.exports = { DataSourceFeedback, isOnline };
