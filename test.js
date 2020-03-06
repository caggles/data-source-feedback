//const dataSourceFeedback = require('./index');
const getPackageInfo = require('./functions/get-package-info');
const isOnline = require('./functions/online');

(async () => {
    console.log(await isOnline());
    let packageInfoPromise = getPackageInfo('grizzly-bear-population-units');
    packageInfoPromise.then(function(packageInfo) {
        console.log(packageInfo);
    });
})();



