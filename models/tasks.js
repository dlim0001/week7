let mongoose = require ('mongoose');

let taskSchema = mongoose.Schema({
    name: String,
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developers'
    },
    due: Date,
    status: String,
    desc: String,
    created:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);