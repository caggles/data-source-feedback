const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://catalogue.data.gov.bc.ca/api/3/',
    timeout: 10000,
    headers: {'accept': '*/*'}
});

module.exports = async function getDataOwners(packageName) {
    const get_response = await instance.get('action/package_show?id=' + packageName);
    const contactList = get_response.data.result.contacts;
    let contactInfo = {
        'to': [],
        'cc': [],
        'bcc': []
    }
    for (let i = 0; i < contactList.length; i++) {
        if (contactList[i].role === 'custodian') {
            contactInfo.to.push(contactList[i].email);
        } else {
            contactInfo.cc.push(contactList[i].email);
        }
    }
    return contactInfo;
}
