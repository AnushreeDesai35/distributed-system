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
	}, 3000);
});

status = {};

function checkup(){
	Object.keys(serviceMapping).forEach((key) => {
		serviceMapping[key]['endpoints'].forEach((endpoint) => {
			callHealthCheck(key, endpoint);
		});
	});
}

let callHealthCheck = async function(key, endpoint) {
	try{
		let response = await fetch(endpoint+'?x=10&y=5');
		let json = await response.json();
		let result = json.result;
		status[key] = true;
	}
	catch(err){
		status[key] = false;
	}
}