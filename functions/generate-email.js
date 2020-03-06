const uuid = require('uuid');

async function convertGeoJsonToAttachment(obj, encoding) {
  let objJsonStr = JSON.stringify(obj);
  let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
  return {
    content: objJsonB64,
    contentType: 'json',
    filename: `${uuid.v4()}.json`,
    encoding: encoding
  };
}


module.exports = async function generateEmail(fromEmail, comment, catalogResult, geoJsons) {

  let attachments = [];
  if (Array.isArray(geoJsons) && geoJsons.length) {
    attachments = await Promise.all(geoJsons.map(g => convertGeoJsonToAttachment(g, 'base64')));
  }

  let to = [];
  let cc = [];
  let bcc = [];
  if (catalogResult.contacts.filter(c => c.type === 'to').length) {
    to = catalogResult.contacts.filter(c => c.type === 'to').map(c => c.email);
    cc = catalogResult.contacts.filter(c => c.type === 'cc').map(c => c.email);
    bcc = catalogResult.contacts.filter(c => c.type === 'bcc').map(c => c.email);
  } else {
    // make everyone a to...
    to = catalogResult.contacts.map(c => c.email);
  }

  to = ['jsherman@parcsystems.ca'];
  cc = [];
  bcc = [];

  const context = {
    to: to,
    cc: cc,
    bcc: bcc,
    context: {
      comment: comment
    }
  };

  const email = {
    from: fromEmail,
    contexts: [context],
    attachments: attachments,
    bodyType: 'html',
    body: '<html><body>{{comment}}</body></html>',
    encoding: 'base64',
    subject: `Feedback on Data Catalog Package: ${catalogResult.title}`
  };

  return email;
};
