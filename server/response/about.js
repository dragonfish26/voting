import ResponseBuilder from './responseBuilder.js';

export default class HTMLResponseBuilder extends ResponseBuilder{

    constructor(request, response, statusCode, contentType) {
        super(request, response, statusCode, contentType);
    }


    build() {
        this.prepareResponse();

        this.renderPage();
    }

    renderPage() {
        const date = new Date().toISOString();

        this.response.write(`<!DOCTYPE html>`);
        this.response.write(`<html>`);
        this.response.write(`<head>
            <meta charset="UTF-8">
            <title>Response</title> 
            </head>`);
        this.response.write(`<body>`);
        this.response.write(`<main>About Page</main>`);
        this.response.write(`<footer>Response generated at ${date}</footer>`);
        this.response.write(`</body>`);
        this.response.write(`</html>`);
        this.response.end();
    }

}
