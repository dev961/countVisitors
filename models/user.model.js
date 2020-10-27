const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    userId: {type: String, required: true, max: 12},
    viewDate: { type : Date, default: Date.now },
    ProductId:{type: String, required: true, max: 12}
});

//Export the model
module.exports = mongoose.model('userView', UserSchema);
