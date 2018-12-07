const express = require('express');
const fetch = require('node-fetch');

class WebService {
    constructor(name, port, ip = "127.0.0.1") {
        if (!port) {
            throw "Port not assigned."
        }
        this.name = name;
        this.endpoint = {
            ip,
            port
        };
        this.registryURL = "http://127.0.0.1:5005/register/<name>";
        this.app = express();
    }

    start(handler) {
        this.app.listen(this.endpoint.port, () => {
            console.log(`${this.name} server listening on port ${this.endpoint.port}...`);
            this.registerService(this.registryURL);
        });
        this.app.all("*", handler);
    }

    registerService(registryURL) {
        let url = registryURL.replace(/<name>/, this.name);
        fetch(url, {
                method: 'POST',
                body: JSON.stringify(this.endpoint),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(json => {
                if (json.result) {
                    // init heartbeat
                }
            });
    }
}

WebService.METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

module.exports = WebService;