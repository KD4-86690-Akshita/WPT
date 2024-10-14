const express=require('express')
const cors=require('cors')
const jwt=require('jsonwebtoken')
const config=require('./config')
const utils=require('./utils')

const app=express()
app.use(cors())
app.use(express.json())

app.use((request,response,next)=>
{ //
    if(
        request.url==='/user/login' ||
        request.url==='/user/register'||
        request.url.startsWith('/image/')
    ){
        next()
    }
    else{
        //console.log(`no json webtoken`)
        //get the token
        const authtoken = request.headers.authorization;
        const token = authtoken.split(' ')[1];
        console.log("$ ",token);
        //const token = request.headers['token']

        if(!token || token.length === 0){
            response.send(utils.createErrorResult('missing token'))
        }else{
            try{
                //verify the token
                const payload=jwt.verify(token,config.secret)

                //add the user id to the request
                request.userId=payload['id']
                 
                //TODO : expiry logic
                // call the real router
                next()

            }catch (ex) {
                response.send(utils.createErrorResult('invalid token'))
            }
        }
        
    }
})

//add the router
const userRouter=require('./router/user')
const categoryRouter=require('./router/category')
const imageRouter=require('./router/image')
const propertyRouter=require('./router/property')
const bookingRouter=require('./router/booking')





app.use('/user',userRouter)
app.use('/category',categoryRouter)
app.use('/image',imageRouter)
app.use('/property',propertyRouter)
app.use('/booking',bookingRouter)




app.listen(4000,'0.0.0.0',()=>{
    console.log(`server started on port 4000`)
})

