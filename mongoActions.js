const admins = require('./admins')

const getAdmins = async ()=>{
    return admins.find({})
}
const newAdmin = async (admin, name, tag)=>{
    if(await admins.findOne({id:admin})) return
    (new admins({
        id:admin,
        name:name,
        tag:tag
    })).save()
}
module.exports = {
    getAdmins,
    newAdmin
}