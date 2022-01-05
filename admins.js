const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    id:{type: Number, required:true, unique:true},
    name:{type: String},
    tag:{type: String}
})

module.exports = model('admins', schema)