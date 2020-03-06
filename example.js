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

const { DataSourceFeedback, isOnline } = require('./index');

if (!process.env.OVERRIDE_TO_EMAILS || !process.env.CHES_CLIENT_ID || !process.env.CHES_CLIENT_SECRET) {
    console.log('Set an override email and ches client credentials');
    console.log(process.env);
    return;
}

const config = {
    dataCatalogUrl: 'https://catalogue.data.gov.bc.ca/api/3',
    chesApiUrl: 'https://ches-master-9f0fbe-dev.pathfinder.gov.bc.ca/api/v1',
    chesTokenUrl: 'https://sso-dev.pathfinder.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token',
    chesClientId: process.env.CHES_CLIENT_ID,
    chesClientSecret: process.env.CHES_CLIENT_SECRET
};

const dataSourceFeedback = new DataSourceFeedback(config);

(async () => {
    await dataSourceFeedback.add('grizzly-bear-population-units', 'this is my comment', [{some: 'geojson'}]);
    const result = await dataSourceFeedback.send(process.env.OVERRIDE_TO_EMAILS);
    console.log(result);
})();
