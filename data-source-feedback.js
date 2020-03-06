const EmailService = require('./utils/email-service');
const MemoryQueue = require('./utils/memory-queue');
const Mutex = require('./utils/mutex-await');

const getPackageInfo = require('./functions/get-package-info');
const generateEmail = require('./functions/generate-email');

class DataSourceFeedback {
    constructor(options) {
        this._dataCatalogUrl = (options && options.dataCatalogUrl) || process.env.DATA_CATALOG_URL || 'https://catalogue.data.gov.bc.ca/api/3';
        this._chesClientId = (options && options.chesClientId) || process.env.CHES_CLIENT_ID;
        this._chesClientSecret = (options && options.chesClientSecret) || process.env.CHES_CLIENT_SECRET;
        this._chesTokenUrl = (options && options.chesTokenUrl) || process.env.CHES_TOKEN_URL || 'https://sso-dev.pathfinder.gov.bc.ca/auth/realms/jbd6rnxw/protocol/openid-connect/token';
        this._chesApiUrl = (options && options.chesApiUrl) || process.env.CHES_API_URL || 'https://ches-master-9f0fbe-dev.pathfinder.gov.bc.ca/api/v1';
        this._queue = new MemoryQueue();
        this._mutex = new Mutex();
        this._emailService = new EmailService({
            tokenUrl: this._chesTokenUrl,
            clientId: this._chesClientId,
            clientSecret: this._chesClientSecret,
            apiUrl: this._chesApiUrl
        });
    }

    async add(packageName, comment, geoJsons = []) {
        const item = {packageName: packageName, comment: comment, geoJsons: geoJsons};
        let unlock = await this._mutex.lock();
        this._queue.enqueue(item);
        // release mutex, allow reading from the queue
        unlock();
    }

    async send(fromEmail) {
        const items = [];
        let unlock = await this._mutex.lock();
        while (this._queue.getLength()) {
            items.push(this._queue.dequeue());
        }
        // release mutex, allow writing to the queue
        unlock();
        // send the items
        let results = items.map(item => this.sendItem(fromEmail, item.packageName, item.comment, item.geoJsons));
        return Promise.all(results);
    }

    async sendItem(fromEmail, packageName, comment, geoJsons) {
        // this is the real work...
        const catalogResult = await getPackageInfo(packageName, this._dataCatalogUrl);
        // handle errors from here?
        const email = await generateEmail(fromEmail, comment, catalogResult, geoJsons);
        // handle errors from here?
        const results = await this._emailService.merge(email);
        // other errors...
        return results;
    }
}

module.exports = DataSourceFeedback;
