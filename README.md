# distributed-system
A distributed system with service discovery and load balancer

These are the directions to setup the whole system on a single machine locally.

1. Install node js in the system: https://nodejs.org/en/download/
2. Download nginx and unzip in C: drive. http://nginx.org/en/download.html
3. copy 'nginx.conf' file from 'distributed-system' to C:\nginx\conf\
4. Go to the 'distributed-system' directory
5. run 'npm install'
6. Open terminal and run 'setup.bat' file
7. Run 'start nginx' in terminal
8. run 'node clients\flood_add.js' or 'node clients\flood_mul.js' in terminal to send multiple requests to web services.
9. You can also use web browser to call any service:
  - localhost/arith/add?x=5&y=7
  - localhost/arith/multiply?x=5&y=7
  - localhost/arith/subtract?x=5&y=7