const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    id:{type: Number, required:true, unique:true}
})

module.exports = model('admins', schema)