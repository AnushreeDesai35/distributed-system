const sha = require("sha256");

class Block{
    constructor(transaction, prevHash){
        this.nounce = 0;
        this.prevHash = prevHash;
        this.timestamp = new Date();
        this.transaction = JSON.stringify(transaction);
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return sha(this.prevHash + this.transaction + this.timestamp + this.nounce);
    }

    isValid(){
        return this.hash == this.calculateHash();
    }

    mine(work){
        let target = "0".repeat(work);
        while(!(this.hash.substr(0, work) == target)){
            // console.log("mining", target, this.hash)
            this.nounce++;
            this.hash = this.calculateHash();
        }
    }

    isMined(work){
        let target = "0".repeat(work);
        return this.hash.substr(0, work) == target;
    }
}

module.exports = Block;