const EmailService = require('./utils/email-service');
const MemoryQueue = require('./utils/memory-queue');
const Mutex = require('./utils/mutex-await');

const getPackageInfo = require('./functions/get-package-info');

class DataSourceFeedback {
    constructor(options) {
        this._dataCatalogUrl = options.dataCatalogUrl || process.env.DATA_CATALOG_URL;
        this._chesClientId = options.chesClientId || process.env.CHES_CLIENT_ID;
        this._chesClientSecret = options.chesClientSecret || process.env.CHES_CLIENT_SECRET;
        this._chesTokenUrl = options.chesTokenUrl || process.env.CHES_TOKEN_URL;
        this._chesApiUrl = options.chesApiUrl || process.env.CHES_API_URL;
        this._queue = new MemoryQueue();
        this._mutex = new Mutex();
        this._emailService = new EmailService({
            tokenUrl: this._chesTokenUrl,
            clientId: this._chesClientId,
            clientSecret: this._chesClientSecret,
            apiUrl: this._chesApiUrl
        });
    }

    async add(packageName, comment, attachments) {
        const item = {packageName: packageName, comment: comment, attachments: attachments};
        let unlock = await this._mutex.lock();
        this._queue.enqueue(item);
        // release mutex, allow reading from the queue
        unlock();
    }

    async send(fromEmail, fromName) {
        const items = [];
        let unlock = await this._mutex.lock();
        while (this._queue.getLength()) {
            items.push(this._queue.dequeue());
        }
        // release mutex, allow writing to the queue
        unlock();
        // send the items
        let results = items.map(item => this.sendItem(fromEmail, fromName, item.packageName, item.comment, item.attachments));
        return results;
    }

    async sendItem(fromEmail, fromName, packageName, comment, attachments) {
        // this is the real work...
        const catalogResult = getPackageInfo(packageName, this._dataCatalogUrl);
        // handle errors from here?
        const emails = undefined; //await buildEmails(fromEmail, fromName, comment, catalogResult, attachments);
        // handle errors from here?
        const results = await this._emailService.merge(emails);
        // other errors...
        return results;
    }
}

module.exports = DataSourceFeedback;
