//const dataSourceFeedback = require('./index');
const getPackageInfo = require('./functions/get-package-info');

let packageInfoPromise = getPackageInfo('grizzly-bear-population-units');
packageInfoPromise.then(function(packageInfo) {
    console.log(packageInfo);
});

