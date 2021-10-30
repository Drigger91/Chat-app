const express = require('express')
const http  = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage , generateLocationMessage} = require('./utils/messages.js')
const {addUser ,removeUser , getUser , getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const publicPath = path.join(__dirname , '../public')
const port  = process.env.PORT || 3000



app.use(express.static(publicPath))

io.on('connection' , (socket)=>{
    console.log('New connection established')
    

    socket.on('join' , ({username , roomname},callback)=>{
        const {error , user} =  addUser({id:socket.id,username,roomname})
        if(error){
            callback(error)
        }
        socket.join(roomname)
        socket.emit('message' , generateMessage(`Welcome to chat app ${user.username}`))
        socket.broadcast.to(user.roomname).emit('message' , generateMessage(`${user.username} has connected`))
        io.to(user.roomname).emit('RoomData' , {
            room : user.roomname,
            users : getUsersInRoom(user.roomname)
        })
    })
    socket.on('sendMessage' , (message ,callback)=>{
        const user = getUser(socket.id)
        io.to(user.roomname).emit('message' , generateMessage(user.username,message))
        callback('Delivered!')
    })
    socket.on('sendLocation',(location , callback)=>{
        const user = getUser(socket.id)
        io.to(user.roomname).emit('locationMessage', generateLocationMessage(user.username,location.latitude , location.longitude))
        callback('Location shared')
     })
    socket.on('disconnect' , ()=>{
        const user = removeUser(socket.id)
        console.log(user)
        if(user){
             io.to(user.roomname).emit('message' , generateMessage(`${user.username} has left`))
             io.to(user.roomname).emit('RoomData' , {
                room : user.roomname,
                users : getUsersInRoom(user.roomname)
            })
        }
        
    })
})
server.listen(port , ()=>{
    console.log('Chat app')

} )