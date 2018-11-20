//     def forward(path):
//         serviceName = path[path.rfind('/'):]
//         print(serviceName)
//         dicoveryRequest = servers[0]+"/service" + serviceName
//         serviceEndpoints = json.loads(get(dicoveryRequest).content)
//         server = serviceEndpoints[forward.current]
//         forward.current = (forward.current + 1) % len(serviceEndpoints)
//         return get(server + path).content

//     forward.current = 0
//     app.run(host="0.0.0.0", port="80")

const express = require("express");

const PORT = 80;
const registryServer = ["http://localhost:5001"];
const app = express();

let requestHandler = (request, response) => {
    response.send("Hello from Express!");
    console.log(request.path, request.url);
    let path = request.path;
    let serviceName = path.substr(path.lastIndexOf('/'));
    let dicoveryRequest = registryServer[0] + "/service" + serviceName;
    let serviceEndpoints = fetch(dicoveryRequest).then(res => res.json()).then(json => json);

};

app.all('*', requestHandler);

app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${PORT}`);
});


// """
// TODO:
// - x-request-forward
// - leastconn algorithm
// - round-robin algorithm
// """
