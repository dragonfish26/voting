import { URL } from 'url';

export default class ResponseBuilder {

    #request;
    #response;
    #statusCode;
    #contentType;

    constructor(request, response, statusCode, contentType) {
        this.#request = request;
        this.#response = response;
        this.#statusCode = statusCode;
        this.#contentType = contentType;
    }

    build() {
        this.prepareResponse();
        this.response.statusCode = this.#statusCode;
        this.response.write('<!DOCTYPE html><html><body><h2>Welcome Home</h2></body></html>');
        this.response.end();
    }

    prepareResponse() {
        this.response.statusCode = this.statusCode;
        this.response.setHeader('Content-Type', this.contentType);
    }

    get request() {
        return this.#request;
    }

    get response() {
        return this.#response;
    }

    get statusCode() {
        return this.#statusCode;
    }

    get contentType() {
        return this.#contentType;
    }

}
