const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const smartContract = new Schema({
    electionId: {
        type: String
    },
    createdUser: {
        type: String
    },
    electionType: {
        type:String
    } ,
    target: {
        type: String
    },
    startDate: {
        type: String
    },
});

module.exports = mongoose.model('smartContract',smartContract);
