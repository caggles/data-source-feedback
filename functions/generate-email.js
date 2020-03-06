const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

async function convertGeoJsonToAttachment(obj, encoding) {
  let objJsonStr = JSON.stringify(obj);
  let objJsonB64 = Buffer.from(objJsonStr).toString(encoding);
  return {
    content: objJsonB64,
    contentType: 'json',
    filename: `${uuid.v4()}.json`,
    encoding: encoding
  };
}

function getAddresses(csv) {
  if (csv && csv.trim().length > 0) {
    return csv.split(',').map(item => item.trim());
  } else {
    return [];
  }
}

module.exports = async function generateEmail(fromEmail, comment, catalogResult, geoJsons) {

  // should validate that everything exists that we expect...

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

  if (process.env.OVERRIDE_TO_EMAILS) {
    to = getAddresses(process.env.OVERRIDE_TO_EMAILS);
    cc = [];
    bcc = [];
    fromEmail = to[0];
  }

  const context = {
    to: to,
    cc: cc,
    bcc: bcc,
    context: {
      feedback_detail: comment,
      object_name: catalogResult.objname,
      organization_name: catalogResult.orgname,
      name: catalogResult.name,
      title: catalogResult.title,
      sender: fromEmail
    }
  };

  const html = path.join(__dirname, '..', 'assets', 'data-source-feedback.html');
  const body = fs.readFileSync(html, {encoding: 'utf8'});

  const email = {
    from: fromEmail,
    contexts: [context],
    attachments: attachments,
    bodyType: 'html',
    body: body,
    encoding: 'base64',
    subject: `Feedback on Data Catalog Package: ${catalogResult.title}`
  };

  return email;
};
