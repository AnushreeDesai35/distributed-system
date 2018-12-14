const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const convert = require('xml-js');
const ledger = require("./BlockChain/Ledger");

class WebService {
    constructor(name) {
        this.fileXMLData = null;
        this.endpoint = {};
        this.name = name;
        this.wsdlPath = process.env.wsdlPath || "Service" + this.name;
        this.registryEndpoint = process.env.REGISTRY || "http://127.0.0.1:8081";
        this.getWSDL();
        this.app = express();
    }

    getEndpoint() {
        let address = this.fileXMLData["wsdl:description"]["wsdl:service"]["wsdl:endpoint"]["_attributes"]["address"];
        let port = address.match(/[0-9]{4}/g)[0];
        return {
            address,
            port
        }
    }

    getWSDL() {
        console.log(this.name);
        fs.readFile(this.wsdlPath + '/WSDL' + this.name + '.xml', (error, data) => {
            if (error) {
                console.log('Error while reading file', error);
            } else {
                var jsonData = convert.xml2js(data, {
                    compact: true,
                    spaces: 4
                });
                this.fileXMLData = jsonData;
                console.log(this.fileXMLData["wsdl:description"]["wsdl:service"]["wsdl:endpoint"]["_attributes"]["address"]);
                this.endpoint = this.getEndpoint();
                this.start();
            }
        });
    }

    start() {
        this.app.listen(this.endpoint.port, () => {
            console.log(`${this.name} server listening on port ${this.endpoint.port}...`);
            this.registerService(this.registryEndpoint);
        });
        this.app.get("*", (req, res) => {
            if (!Object.keys(req.query).length) {
                console.log("Health Checkup.");
                return true;
            } else{
                this.get(req, res);
                ledger.record({

                });
            }
        });
    }

    get(req, res) {
        return false;
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
                json.result
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
                json.result
            });
    }
}

WebService.Config = {
    SLB: process.env.SLB || "http://localhost:8088",
    LBFallback: process.env.LBF || "http://localhost:80"
}

WebService.sleep = (ms) => {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
    }
};

module.exports = WebService;