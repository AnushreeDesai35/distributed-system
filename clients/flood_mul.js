const fetch = require("node-fetch");

let test1 = function (params) {

    for(let i=0; i < 10; i++){
         fetch("http://localhost/arith/multiply?x=7&y=3")
         .then((res)=>{return res.json()})
         .then((data)=>{
            console.log(data)
         })
         console.log("sent")
    }

}

test1()