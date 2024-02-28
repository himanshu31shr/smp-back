class Response {

    #_statusCode = 200;

    #_message;

    #_payload;

    constructor(payload, message, statusCode) {
        this.#_payload = payload;
        this.#_message = message;
        this.#_statusCode = statusCode || this.#_statusCode;
    }

    toJSON() {
        return {
            status: this.#_status,
            message: this.#_message,
            payload: this.#_payload,
        }
    };

    toString() {
        return this.#_message;
    }

    get #_status() {
        return this.#_statusCode === 200;
    }

    pipe(res) {
        return res.json(this.toJSON());
    }

}

class RespondSuccess extends Response {
    #_statusCode = 200; 

}

class RespondError extends Response {
    #_statusCode = 500; 
}

module.exports = {
    RespondSuccess,
    RespondError,
};
