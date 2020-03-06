//const dataSourceFeedback = require('./index');
const getDataOwners = require('./functions/data-owner-call');

let contactInfoPromise = getDataOwners('grizzly-bear-population-units');
contactInfoPromise.then(function(contactInfo) {
    console.log(contactInfo);
});

