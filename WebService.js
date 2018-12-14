const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const convert = require('xml-js');

class WebService {
    constructor(name) {
        this.fileXMLData = null;
        this.endpoint = {};
        this.name = name;
        this.registryEndpoint = "http://127.0.0.1:8081";
        this.getWSDL();
        this.app = express();
    }

    getEndpoint(){
        let address = this.fileXMLData["wsdl:description"]["wsdl:service"]["wsdl:endpoint"]["_attributes"]["address"];
        let port = address.match(/[0-9]{4}/g)[0];
        return {
            address, port
        }
    }

    getWSDL() {
        console.log(this.name)
        fs.readFile('Service'+this.name+'/WSDL'+this.name+'.xml', (error, data) => {
            if(error){
                console.log('Error while reading file', error);
            }
            else {
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
        this.app.get("*", this.get);
    }

    get(req, res){
        return "Request Not Supported.";
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
                    // stop heartbeat
                }
            });
    }
}

WebService.Endpoints = {
    SLB: "http://localhost:8088",
    LBFallback: "http://localhost:80"
}

WebService.sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    })
};

module.exports = WebService;