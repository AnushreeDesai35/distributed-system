const fetch = require("node-fetch");

let test1 = function (params) {

   let j = 0;
   let start = new Date().getTime()
    for(let i=0; i < 10; i++){
         fetch("http://localhost/arith/multiply?x=6&y=8")
         .then((res)=>{return res.json()})
         .then((data)=>{
            console.log(data)
            j++
            if(j == 10){
               console.log(new Date().getTime() - start)
            }
         })
    }

}

test1()