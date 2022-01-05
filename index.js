const { Telegraf } = require('telegraf')
const mongoose = require('mongoose')
const {getAdmins, newAdmin} = require('./mongoActions')
require('dotenv').config()

const bot = new Telegraf(process.env.token)

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})

const sendToChannel=async (reply)=>{
    if(reply){
        if(reply.photo)
        {
            bot.telegram.sendPhoto(process.env.channel, reply.photo[0].file_id,{caption:process.env.channel})
        }else if(reply.audio)
        {
            bot.telegram.sendAudio(process.env.channel, reply.audio.file_id,{caption:process.env.channel})

        } else if(reply.video){
            bot.telegram.sendVideo(process.env.channel, reply.video.file_id,{caption:+process.env.channel})
        } 
        else if(reply.text){
            bot.telegram.sendMessage(process.env.channel, reply.text + '\n\n'+process.env.channel)
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
        await newAdmin(ctx.message.reply_to_message.from.id)
    }
})
bot.hears('id', async(ctx)=>{
    console.log(ctx.message)
})
bot.command('post', async (mes)=>{
    if(adminList.find(elem=>elem.id === mes.message.from.id)){
        sendToChannel(mes.message.reply_to_message)
    }
})
bot.on('photo', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendPhoto(process.env.adminchat, ctx.message.photo[0].file_id )
})
bot.on('text', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendMessage(process.env.adminchat, ctx.message.text)
})
bot.on('video', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendVideo(process.env.adminchat, ctx.message.video.file_id)
})
bot.on('audio', async ctx=>{
    if(!ctx.chat.type.includes('private')) return;
    if(adminList.find(elem=>elem.id === ctx.message.from.id)){
        sendToChannel(ctx.message)
        return
    }
    ctx.telegram.sendAudio(process.env.adminchat, ctx.message.audio.file_id)
})



async function start () {
    await mongoose.connect(process.env.mongoDB)
    adminList = await getAdmins()
    await bot.launch()
}

start()
