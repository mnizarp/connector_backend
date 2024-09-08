import express,{Application} from 'express'
import http from 'http'
import {Server as SocketIoServer} from 'socket.io'
import dotenv from 'dotenv'
import connectDb from './config/connectDb'
import cors from 'cors'
import axios from 'axios'
import path from 'path'
import { errorHandler, notFound } from './middlewares/errorMiddlewares'
import { chatRouter } from './routes/chatRoutes'
import authRouter from './routes/authRoutes'
import countryRouter from './routes/countryRoutes'
import postRouter from './routes/postRoutes'
import userRouter from './routes/userRoutes'
import commentRouter from './routes/commentRoutes'
import notificationRouter from './routes/notificationRoutes'


const url = `https://connector-backend-vrue.onrender.com`; 
const interval = 600000; 

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);

dotenv.config()
// const corsOptions = {
//     origin: process.env.CLIENT_PORT, 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials:true 
//   };

const app:Application=express()
const server=http.createServer(app)
const io=new SocketIoServer(server,{
  pingTimeout:60000,
})

dotenv.config()
app.use(cors())
app.use(express.json({limit:'15mb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
connectDb()


app.use('/api/auth/',authRouter)
app.use('/api/country/',countryRouter)
app.use('/api/chat/',chatRouter)
app.use('/api/post',postRouter)
app.use('/api/comment',commentRouter)
app.use('/api/user',userRouter)
app.use('/api/notification',notificationRouter)

  app.get('/',(req,res)=>res.send('Server is ready'))

app.use(notFound)
app.use(errorHandler)
const port=process.env.PORT || 9009
server.listen(port,()=>{
    console.log(`server connected on port = ${port}`)
})

io.on('connection',(socket)=>{

  socket.on('setup',(userId)=>{ 
    socket.join(userId)
    socket.emit('connected')
  })     

  socket.on('join chat',(room)=>{
   socket.join(room)
  }) 

  socket.on('leave chat', (room) => {
    socket.leave(room);
  });

  socket.on('new message',(newMessageRecieved)=>{
    let chat=newMessageRecieved?.chatId
    io.in(chat).emit('message recieved', newMessageRecieved);
})       

})


// socket.on('typing',(room)=>socket.in(room).emit('typing'))
// socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

// socket.on('join session',(room)=>{
//   socket.join(room)
//  })

//  socket.on('leave session', (room) => {
//   socket.leave(room);
// });

// socket.on('quit session', (room) => {
//   socket.leave(room);
// });

// socket.on('close session',(room)=>{
//   io.to(room).emit('quit session',room);
// })



// socket.on('new sessionmessage',(newMessageRecieved)=>{
//   let session=newMessageRecieved?.session_id
//   if(!session?.members) return console.log('session members not defined')
//   session?.members?.forEach((member:any)=>{
//       socket.in(member).emit('sessionmessage recieved',newMessageRecieved)
//   })
//   socket.in(session.host).emit('sessionmessage recieved',newMessageRecieved)
// })


// socket.on('new notification',(newNotificationRecieved)=>{
//   let userId=newNotificationRecieved?.user_id

//   socket.in(userId).emit('notification recieved',newNotificationRecieved)
// })
