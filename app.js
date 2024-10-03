import { Server } from "socket.io";

const port = process.env.PORT || 4000
const io = new Server({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Dynamically allow the frontend URL
        methods: ["GET", "POST"]
    }
})

let onlineUser = []
const addUser = (userId, socketId) => {
    const existingUser = onlineUser.find((user) => user.id === userId)
    if (!existingUser) {
        onlineUser.push({ userId, socketId })
    }
}
// remove user from online array 
const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId)
}

//get the user actually 
const getUser = (userId) => {
    return onlineUser.find(user => user.userId === userId)
}


io.on("connection", (socket) => {
    socket.on('newUser', (userId) => {
        addUser(userId, socket.id)
        console.log(onlineUser)
    })
    socket.on("sendMessage", ({ recieverId, data }) => {
        const reciever = getUser(recieverId);
        io.to(reciever.socketId).emit("getMessage", data)
    })
    socket.on('disconnet', () => {
        removeUser(socket.id)
    })
})

io.listen(port)

