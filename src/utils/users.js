const users = []

//add user
const addUser = ({id , username , roomname}) =>{
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    if(!username || !roomname){
        return {
            error : "Username and roomname are required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.roomname ===roomname && user.username===username
    })

    if(existingUser){
        return { 
            error : "Username already taken"
        }
    }
    const user = {
        id,username,roomname
    }
    users.push(user)
    return {user}
}
//remove user


const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index!==-1){
        return users.splice(index , 1)[0]
    }
}
//get user 
const getUser = (id)=>{
    const user = users.find((user)=>{
        return user.id === id
    })
    if(user){
        return user
    }
    else{
        return {
            error : "User not found"
        }
    }
}

//get users in roomname

const getUsersInRoom = (roomname)=>{
   roomname = roomname.trim().toLowerCase()
   return users.filter((user)=>{
       return user.roomname === roomname
   })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}