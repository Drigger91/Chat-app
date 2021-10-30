const socket = io()

const form = document.getElementById("message-form")
const formButton = form.querySelector("button")
const formInput = document.querySelector("input")
const locationButton = document.getElementById('location-button')
const messages = document.querySelector('#messages')
//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const options = location.search.split("=");
const username = options[1].split("&")[0];
const roomname = options[2];
const autoscroll = ()=>{
    const lastMessage = messages.lastElementChild

    const lastMessageStyles = getComputedStyle(lastMessage)
    const margin = parseInt(lastMessageStyles.marginBottom)
    const height = margin + lastMessage.offsetHeight

    const visibleHeight = messages.offsetHeight
    const containerHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - height <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
}
socket.on('message' , (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate , {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('HH:mm')
    })
    
    messages.insertAdjacentHTML("beforeend" ,html)
    autoscroll()
})
socket.on('locationMessage' , (url)=>{
    console.log(url)
    const locationURL = Mustache.render(locationTemplate , {
        username : url.username,
        location : url.url ,
        createdAt : moment(url.createdAt).format('HH:mm')
    })
    messages.insertAdjacentHTML('beforeend',locationURL)
    autoscroll()
})
socket.on('RoomData' , (data)=>{
    const list = Mustache.render(sidebarTemplate ,{
        room : data.room ,
        users : data.users
    } )
    document.getElementById('sidebar').innerHTML = list
})
form.addEventListener('submit' , (e)=>{
    e.preventDefault()
    formButton.setAttribute('disabled' , 'disabled')
    const message = formInput.value
    socket.emit('sendMessage' , message , (msg)=>{
        formButton.removeAttribute('disabled')
        formInput.value = ''
        formInput.focus()
        console.log("The message was delivered" , msg)
    })
})
locationButton.addEventListener('click' , ()=>{
   if (!navigator.geolocation){
       return alert('Geolocation is not supported by your browser')
   }
   locationButton.setAttribute('disbled' , 'disabled')
   navigator.geolocation.getCurrentPosition((position)=>{
       const location = {
           latitude : position.coords.latitude,
           longitude : position.coords.longitude
       }
       socket.emit('sendLocation' , location , (msg)=>{
           locationButton.removeAttribute('disabled')
           console.log(msg)
       })
   })
})

socket.emit('join' , {username,roomname} , (error)=>{
    if(error)
   { window.alert(error)
     location.href = '/'
    }

})

