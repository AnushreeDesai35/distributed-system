const Block = require("./Block");

class Ledger{
    constructor(work){
        this.work = work;
        this.chain = [];
        let genesis = new Block({}, 0);
        genesis.mine(work);
        this.chain.push(genesis);
    }

    record(transaction){
        let lastBlock = this.chain[this.chain.length - 1]
        let block = new Block(transaction, lastBlock.prevHash);
        block.mine(this.work);
        this.chain.push(block);
    }

    isValid(){
        for(let i=1; i < this.chain.length; i++){
            let prev = this.chain[i - 1];
            let curr = this.chain[i];

            if(prev.hash != curr.prevHash){
                return false;
            }

            if(!curr.isValid()){
                return false;
            }

            if(!curr.isMined(this.work)){
                return false;
            }
        }

        return true;
    }
}

let ledger = new Ledger(3);
module.exports = ledger;