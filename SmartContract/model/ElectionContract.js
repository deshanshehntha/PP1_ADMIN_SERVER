var Candidate = require("../model/Candidate");
var SmartContractInterface = require("../core/SmartContractInterface");


class ElectionContract extends SmartContractInterface{

    _candidates = [];
    _voters = [];
    _electionCategory = '';
    _electionName = '';
    _description = '';
    _startDate = '';
    _endDate = '';
    _clusterLeaderNode = '';

    constructor(electionCategory,
                creator,
                electionName,
                voters,
                candidates,
                description,
                startDate,
                endDate,
                clusterLeaderNode) {
        super(creator);
        this._electionCategory = electionCategory;
        this._voters = voters;
        this._candidates = candidates;
        this._electionName = electionName;
        this._description = description;
        this._startDate = startDate;
        this._endDate = endDate;
        this._clusterLeaderNode = clusterLeaderNode;
    }

    addCandidate(name) {
        const candidate = new Candidate(name)
        this._candidates.push(candidate);
    }

    addPermissionToVoters(voter) {
        if(this._voters.includes(voter)) {
            voter._weight = 1;
        } else {
            voter._weight = 0;
        }
    }

    async addToRecordPool(data) {
       await this._chain.addRecordToRecordPool(data);
    }

    async mineRecordPoolBlocks() {
        await this._chain.mineRecords();

    }

    getContractId() {
        return this._contractId;
    }

}
module.exports = ElectionContract;
