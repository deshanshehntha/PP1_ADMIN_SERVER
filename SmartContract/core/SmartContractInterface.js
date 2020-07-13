
const Blockchain = require('izigma-blockchain');


class SmartContractInterface {

    _contractId = '';
    _creator = '';
    _startTime = '';
    _chain = new Blockchain();

    constructor(creator) {
        const { v4: uuidv4 } = require('uuid');

        this._contractId = uuidv4();
        this._creator = creator;
        this._startTime = Date.now();
        this.initiateBlockchain().then(r => {
            console.log("initialized the blockchain in the interface")
        })
    }

    deploy() {
        this._startTime = Date.now() ;
    }

    async initiateBlockchain() {
        this._chain = new Blockchain();
        let check = await this._chain.isBlockchainExsist();

        if (!check) {
            await this._chain.addGenesisBlock()
        }
    }


    async readBlock() {
        let blockchain = [];

        blockchain = await this._chain.getChain()
        return blockchain;
    }



}
module.exports = SmartContractInterface;
