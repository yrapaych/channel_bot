const admins = require('./admins')

const getAdmins = async ()=>{
    return admins.find({})
}
const newAdmin = async (admin)=>{
    if(await admins.findOne({id:admin})) return
    (new admins({
        id:admin
    })).save()
}
module.exports = {
    getAdmins,
    newAdmin
}