const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');

const handleError = (e) => {
    if (e.response) {
        throw new Error(`CHES Error (${e.response.status}): ${e.response.data.detail}`);
    } else {
        throw new Error(`Unknown CHES Error:  ${e.message}`);
    }
};

class OAuthConnection {
    constructor({tokenUrl, clientId, clientSecret}) {
        if (!tokenUrl || !clientId || !clientSecret) {
            throw new Error('OAuthConnection is not configured.  Check configuration.');
        }

        this.tokenUrl = tokenUrl;

        this.axios = axios.create();
        this.axios.interceptors.request.use(
            // Wraps axios-token-interceptor with oauth-specific configuration,
            // fetches the token using the desired claim method, and caches
            // until the token expires
            oauth.interceptor(tokenProvider, oauth.client(axios.create(), {
                url: this.tokenUrl,
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                scope: ''
            }))
        );
    }
}

class EmailService {
    constructor({tokenUrl, clientId, clientSecret, apiUrl}) {
        if (!tokenUrl || !clientId || !clientSecret || !apiUrl) {
            throw new Error('EmailService is not configured.  Check configuration.');
        }
        this._connection = new OAuthConnection({tokenUrl, clientId, clientSecret});
        this._axios = this._connection.axios;
        this._apiUrl = apiUrl;
    }

    async send(email) {
        try {
            const response = await this._axios.post(
                `${this._apiUrl}/email`,
                email,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );
            return response.data;
        } catch (e) {
            handleError(e);
        }
    }


    async merge(data) {
        try {
            const response = await this._axios.post(
                `${this._apiUrl}/emailMerge`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );
            return response.data;
        } catch (e) {
            handleError(e);
        }
    }

}

module.exports = EmailService;
