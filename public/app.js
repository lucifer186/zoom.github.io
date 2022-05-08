// const { Socket } = require("socket.io");
const socket = io.connect()
const videoGrid = document.getElementById('videoGrid')
const myVideo = document.createElement('video');
myVideo.muted = true;
let names
do{
   names = prompt('Plaese enter your name')
}while(!names)

var peer = new Peer(undefined,{
    host: '/',
    path:'/peerjs',
    port:'443'
})

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected',(userId)=>{
        connectTouser(userId,stream);
    })
})
peer.on('open', id=>{
    socket.emit('join-room', RoomId, id)
    
})



const connectTouser = (userId, stream) =>{
    const call = peer.call(userId, stream);
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })

    videoGrid.append(video);
}
socket.emit('new-user-joined', names)
let text =  $('input')
$('html').keydown((e) =>{
    if(e.which == 13 && text.val().length !== 0){
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
        
    }
})



socket.on('createMessage', data =>{
   
    $('ul').append(`<li class="message"><b>${data.names}</b><br/>${data.message}</li> <br/> `)
    scrollToBottom();
})

const scrollToBottom = () =>{
    let d = $('.main_chat_window')
    d.scrollTop(d.prop('scrollHeight'))
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton()
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true
    }
}

const setMuteButton = () =>{
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html
}

const setUnmuteButton = () =>{
    const html = `
    <i class="unmute  fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html
}

const setVideo = () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true
    }
}
const setPlayVideo = () =>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Start Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html
}

const  setStopVideo = () =>{
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html
}

const closemeeting =() =>{
    window.open(location.href, "_self", "");
    window.close()
    
}

