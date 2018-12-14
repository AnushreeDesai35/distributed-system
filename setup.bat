set REGISTRY=http://localhost:8081

:: LoadBalancer - 1
set PORT=8091
start node LoadBalancer\LoadBalancer.js

:: LoadBalancer - 2
set PORT=8092
start node LoadBalancer\LoadBalancer.js

:: Server LoadBalancer
set PORT=8088
start node LoadBalancer\LoadBalancer.js

:: Registry Service
set PORT=8081
set LB1=http://localhost:8091
set LB2=http://localhost:8092
set SLB=http://localhost:8088
start node --experimental-worker ServiceRegistry\ServiceRegistry.js

::nginx - DNS for LBs
start C:\nginx\nginx

::Web Services
set SLB=http://localhost:8088
set LBF=http://localhost:80

:: Server A
set wsdlPath=instances/serverA
start node ServiceAdd\Add.js

:: Server B
set wsdlPath=instances/serverB
start node ServiceAdd\Add.js
start node ServiceMultiply\Multiply.js
start node ServiceSubtract\Subtract.js

:: Server C
set wsdlPath=instances/serverC
start node ServiceAdd\Add.js
start node ServiceMultiply\Multiply.js
start node ServiceSubtract\Subtract.js

:: Server D
set wsdlPath=instances/serverD
start node ServiceAdd\Add.js
start node ServiceSubtract\Subtract.js
