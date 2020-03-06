const axios = require('axios');

module.exports = async function getPackageInfo(packageName, url = 'https://catalogue.data.gov.bc.ca/api/3/') {
    const get_response = await axios.get(`action/package_show?id=${packageName}`,
        {
            baseURL: url,
            timeout: 10000,
            headers: {'accept': '*/*'}
        });
    const packageFull = get_response.data.result;
    let packageInfo = {
        objname: packageFull.object_name,
        name: packageFull.name,
        orgname: packageFull.organization.name,
        title: packageFull.title,
        contacts: []
    }
    for (let i = 0; i < packageFull.contacts.length; i++) {
        if (packageFull.contacts[i].delete === '0') {
            let contact = {
                name: packageFull.contacts[i].name,
                email: packageFull.contacts[i].email
            };
            if (packageFull.contacts[i].role === 'custodian') {
                contact.type = "to";
            } else {
                contact.type = "cc";
            }
            packageInfo.contacts.push(contact);
        }
    }
    return packageInfo;
}
