const {  parentPort, workerData } = require('worker_threads');
const fetch = require('node-fetch');

serviceMapping = {};
timer = 0;
parentPort.on('message', (data) => {
	if (timer) clearInterval(timer);
	serviceMapping = data;
	timer = setInterval(() => {
		checkup();
		parentPort.postMessage(status);
	}, 10000);
});

status = {};

function checkup(){
	Object.keys(serviceMapping).forEach((key) => {
		serviceMapping[key].forEach((endpoint) => {
			callHealthCheck(endpoint);
		});
	});
}

let callHealthCheck = async function(endpoint) {
	try{
		let response = await fetch(endpoint+'?x=10&y=5');
		let json = await response.json();
		let result = json.result;
		status[endpoint] = true;
	}
	catch(err){
		status[endpoint] = false;
	}
}