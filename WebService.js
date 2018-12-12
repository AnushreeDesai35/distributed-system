const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const convert = require('xml-js');

class WebService {
    constructor(name, port) {
        if (!port) {
            throw "Port not assigned.";
        }
        this.name = name;
        this.wsdl = this.getWSDL();
        this.app = express();
    }

    getWSDL() {
        let fileXMLData = null;
        let serviceMapping = null;
        fs.readFile('Service'+this.name+'/WSDL'+this.name+'.xml', (error, data) => {
            if(error){
                console.log('Error while reading file', error);
            }
            else {
                var jsonData = convert.xml2js(data, {
                    compact: true,
                    spaces: 4
                });
                fileXMLData = jsonData;
                console.log(fileXMLData);
            }
        });
        return serviceMapping;
    }

    start(handler) {
        this.app.listen(this.endpoint.port, () => {
            console.log(`${this.name} server listening on port ${this.endpoint.port}...`);
            this.registerService(this.registryEndpoint);
        });
        this.app.all("*", handler);
    }

    registerService(registryEndpoint) {
        let registryURL = `${registryEndpoint}/register/${this.name}`;
        fetch(registryURL, {
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

    unregisterService(registryEndpoint) {
        let registryURL = `${registryEndpoint}/unregister/${this.name}`;
        fetch(registryURL, {
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