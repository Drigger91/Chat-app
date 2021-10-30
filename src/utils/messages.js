const generateMessages = (name,text)=>{
    return {
        username : name,
        text,
        createdAt : new Date().getTime()
    }
}
const generateLocationMessage = (name,a,b)=>{
    return { 
        username : name,
        url : `https://google.com/maps?q=${a},${b}` , 
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage : generateMessages , 
    generateLocationMessage : generateLocationMessage
}