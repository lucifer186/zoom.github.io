const express = require('express')
const { v4: uuidv4 } = require('uuid')

const { ExpressPeerServer} = require('peer')
const app  = express();

const http = require('http').Server(app)

const io = require('socket.io')(http)
const peerserver = ExpressPeerServer(http, {
    debug: true
})
const port = process.env.PORT || 8080

const user = {}

app.set('views','view')
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use('/peerjs', peerserver)
app.get('/', (req, res) => {
 res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res) =>{
    res.render('room', {roomId:req.params.room })
})

io.on('connection', socket =>{
    socket.on('new-user-joined', names =>{
        console.log(names);
        user[socket.id] = names;
        // socket.broadcast.emit('createMessage', names)
    })
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId)
        // console.log('joined room');
      
        socket.on('message', (message) =>{
            io.to(roomId).emit('createMessage', {message: message, names: user[socket.id]})
        })
    })
})



http.listen(port, ()=>{

    console.log(`Listen on port ${port}`);
})