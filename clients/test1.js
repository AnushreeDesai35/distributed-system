const fetch = require("node-fetch");

let test1 = function (params) {

    for(let i=0; i < 10; i++){
         fetch("http://localhost/arith/add?x=6&y=8")
         .then((res)=>{return res.json()})
         .then((data)=>{
            console.log(data)
         })
         console.log("sent")
    }

}

test1()