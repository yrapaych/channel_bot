const { Telegraf } = require('telegraf')
const mongoose = require('mongoose')
const {getAdmins, newAdmin} = require('./mongoActions')
require('dotenv').config()

const bot = new Telegraf(process.env.token)

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
})
  

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
bot.command('post', async (mes)=>{
    if(adminList.find(elem=>elem.id === mes.message.from.id)){
        const reply = mes.message.reply_to_message
        if(reply){
            if(reply.photo)
            {
                bot.telegram.sendPhoto(process.env.channel, reply.photo[0].file_id,{caption:(reply.caption?reply.caption:'')+"\n\n"+process.env.channel})
            }else if(reply.audio)
            {
                bot.telegram.sendAudio(process.env.channel, reply.audio.file_id,{caption:'\n\n'+process.env.channel})

            } else if(reply.video){
                bot.telegram.sendVideo(process.env.channel, reply.video.file_id,{caption:(reply.caption?reply.caption:'')+'\n\n'+process.env.channel})
            } 
            else if(reply.text){
                bot.telegram.sendMessage(process.env.channel, reply.text + '\n\n'+process.env.channel)
            }
        }
    }
})
bot.on('photo', async ctx=>{
    if(ctx.chat.id ===process.env.adminchat)return
    ctx.telegram.sendPhoto(process.env.adminchat, ctx.message.photo[0].file_id, {caption:ctx.message.caption?ctx.message.caption:''+'\n\nBy '+ctx.message.from.first_name})
})
bot.on('text', async ctx=>{
    if(ctx.chat.id ===process.env.adminchat)return
    ctx.telegram.sendMessage(process.env.adminchat, ctx.message.text + '\n\nBy '+ctx.message.from.first_name)
})
bot.on('video', async ctx=>{
    if(ctx.chat.id ===process.env.adminchat)return
    ctx.telegram.sendVideo(process.env.adminchat, ctx.message.video.file_id, {caption:ctx.message.caption?ctx.message.caption:''+'\n\nBy '+ctx.message.from.first_name})
})
bot.on('audio', async ctx=>{
    if(ctx.chat.id ===process.env.adminchat)return
    ctx.telegram.sendAudio(process.env.adminchat, ctx.message.audio.file_id, {caption:'\n\nBy '+ctx.message.from.first_name})
})



async function start () {
    await mongoose.connect(process.env.mongoDB)
    adminList = await getAdmins()
    await bot.launch()
}

start()