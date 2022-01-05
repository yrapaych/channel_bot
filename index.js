const { Telegraf } = require('telegraf')
const mongoose = require('mongoose')
const {getAdmins, newAdmin} = require('./mongoActions')
require('dotenv').config()

const bot = new Telegraf(process.env.token,	{
  handlerTimeout: 10000
})

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})

const sendToChannel=async (reply, message=null)=>{
    if(reply){
        let mes = reply
        if(message){
            mes = message
        }
        if(reply.text){
            bot.telegram.sendMessage(process.env.channel, reply.text+ '\n' +(reply.chat.id===parseInt(process.env.adminchat, 10)?process.env.channel:('\nBy '+ mes.from.first_name +'\n'+ process.env.channel)))
            return
        }
        const caption = reply.chat.id===parseInt(process.env.adminchat, 10)?reply.caption +'\n'+process.env.channel:('By '+ mes.from.first_name +'\n'+ process.env.channel)
        if(reply.photo)
        {
            bot.telegram.sendPhoto(process.env.channel, reply.photo[0].file_id,{caption:caption})
        }else if(reply.audio)
        {
            bot.telegram.sendAudio(process.env.channel, reply.audio.file_id,{caption:caption})

        } else if(reply.video){
            bot.telegram.sendVideo(process.env.channel, reply.video.file_id,{caption:caption})
        } 
    }
}

bot.start(async (mes) => {
    bot.stop()
    await mongoose.disconnect()
    start()
})
bot.command('newadmin', async (ctx)=>{
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        await newAdmin(ctx.message.reply_to_message.from.id,ctx.message.reply_to_message.from.first_name, ctx.message.reply_to_message.from.username)
    }
})
bot.command('post', async (mes)=>{
    if(adminList.find(elem=>elem.id === mes.message.from.id)){
        sendToChannel(mes.message.reply_to_message, mes.message)
    }
})
bot.on('photo', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendPhoto(process.env.adminchat, ctx.message.photo[0].file_id, {caption:'\nBy ' + ctx.message.from.first_name})
})
bot.on('text', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendMessage(process.env.adminchat, ctx.message.text + '\n\n' + ctx.message.from.first_name)
})
bot.on('video', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendVideo(process.env.adminchat, ctx.message.video.file_id, {caption:'\nBy ' + ctx.message.from.first_name})
})
bot.on('audio', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendAudio(process.env.adminchat, ctx.message.audio.file_id, {caption:'\nBy ' + ctx.message.from.first_name})
})



async function start () {
    await mongoose.connect(process.env.mongoDB)
    adminList = await getAdmins()
    await bot.launch()
}

start()
