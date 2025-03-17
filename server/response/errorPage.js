import ResponseBuilder from './responseBuilder.js';

export default class HTMLResponseBuilder extends ResponseBuilder{

    constructor(request, response, statusCode, contentType) {
        super(request, response, statusCode, contentType);
    }


    build() {
        this.prepareResponse();

        this.renderErrorPage();
    }


    renderErrorPage() {
        this.response.write(`<!DOCTYPE html>`);
        this.response.write(`<html>`);
        this.response.write(`<head><title>404 Not Found</title></head>`);
        this.response.write(`<body>`);
        this.response.write(`<h1>404 Not Found</h1>`);
        this.response.write(`<p>Error page</p>`);
        this.response.write(`</body>`);
        this.response.write(`</html>`);
        this.response.end();
    }

}