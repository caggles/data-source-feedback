const getPackageInfo = require('./functions/get-package-info');
const generateEmail = require('./functions/generate-email');

let packageInfoPromise = getPackageInfo('grizzly-bear-population-units');
packageInfoPromise.then(function (packageInfo) {
    console.log(packageInfo);
});

const packageInfoData = {
    objname: 'WHSE_WILDLIFE_INVENTORY.GCPB_GRIZZLY_BEAR_POP_UNITS_SP',
    name: 'grizzly-bear-population-units',
    orgname: 'wildlife-and-habitat',
    title: 'Grizzly Bear Population Units',
    contacts:
        [{
            name: 'Garth Mowat',
            email: 'Garth.Mowat@gov.bc.ca',
            type: 'cc'
        },
            {
                name: 'Jennifer Psyllakis',
                email: 'Jennifer.Psyllakis@gov.bc.ca',
                type: 'to'
            }]
};


let generateEmailPromise = generateEmail('bad@email.org', 'this is some comment', packageInfoData, [{this: 'is', some: 'json'}]);
generateEmailPromise.then(function (result) {
    console.log(result);
});





