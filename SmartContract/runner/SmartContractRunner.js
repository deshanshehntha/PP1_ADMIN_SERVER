var ElectionContract = require("../model/ElectionContract");
const HalfNodeConnectionStore = require("../../halfnodeConnectionStore");

class SmartContractRunner {


    static _contracts = []


    constructor() {
        SmartContractRunner._contracts = [];
    }

    startSmartContract(electionCategory,
                       creator,
                       electionName,
                       voters,
                       candidates,
                       description,
                       startDate,
                       endDate) {

        const clusterLeaderNode =  this.mainClusterNodeSelectionAlgorithm();
        console.log(clusterLeaderNode);

        const contract = new ElectionContract(electionCategory,
            creator,
            electionName,
            voters,
            candidates,
            description,
            startDate,
            endDate,
            clusterLeaderNode)

        contract.deploy();
        SmartContractRunner._contracts.push(contract);
        return contract.getContractId();
    }

    getSmartContract(contract_id) {
        const contract =  SmartContractRunner._contracts.find(contract => contract._contractId === contract_id);
        console.log(SmartContractRunner._contracts);
        return contract;
    }

    getAllContracts() {
        return SmartContractRunner._contracts;
    }

    addBlock(id, transaction) {
        const contract =  SmartContractRunner._contracts.find(contract => contract._contractId === id);
        console.log(contract);
    }

    async readResults(id) {
        const contract = SmartContractRunner._contracts.find(contract => contract._contractId === id);
        let f = await contract.readBlock();
        console.log(f);
        return f;
    }

    async addToRecordPool(data, id) {
        const contract =  SmartContractRunner._contracts.find(contract => contract._contractId === id);
        contract.addToRecordPool(data).then(async ()=> {
            console.log("Added to record pool");
        })
    }

    async mineBlocks(id) {
        const contract =  SmartContractRunner._contracts.find(contract => contract._contractId === id);
        contract.mineRecordPoolBlocks().then(r => {
            console.log("Blocks mined")
        })
    }

    mainClusterNodeSelectionAlgorithm() {
            var byDate = HalfNodeConnectionStore.getAll().slice(0);
            byDate.sort(function(a,b) {
                return a.timestamp - b.timestamp;
            });
            byDate[0].timestamp = Date.now();
            console.log(byDate[0].url);
            return byDate[0].url;
    }


}

const instance = new SmartContractRunner();

module.exports = instance;

