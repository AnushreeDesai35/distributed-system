:: LoadBalancer - 1
start node LoadBalancer.js

start node ServiceRegistry.js --port 8081

start node Add.js --port 5001

start node Add.js --port 5002

start node Add.js --port 5003

start node Subtract.js --port 5004

start node Subtract.js --port 5005

:: Server LoadBalancer
start node LoadBalancer.js --port 8082