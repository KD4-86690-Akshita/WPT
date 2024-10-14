const express=require('express')
const db=require('../db')
const utils=require('../utils')
const crypto=require('crypto-js')
const jwt=require('jsonwebtoken')
const config=require('../config')


const router=express.Router()

router.post('/register',(request,response)=>{
    console.log("Inside register");
    const {firstName,lastName,email,password,phone}=request.body
    const statement=`insert into user (firstName,lastName,email,password,phoneNumber) values (?,?,?,?,?);` //as per database column
    const encryptedPassword=String(crypto.SHA256(password))
    db.pool.execute(
        statement,[firstName,lastName,email,encryptedPassword,phone],
        (error,result)=>{
            response.send(utils.createResult(error,result))
        }
    )
})

router.get('/profile/',(request,response)=>{
    const statement=`select firstName,lastName,phoneNumber,email from user where id=?`
    db.pool.execute(statement,[request.userId],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})

// update profile
router.put('/profile/',(request,response)=>{
    const { firstName ,lastName,phone }=request.body
    const statement=`update user set firstName=?,lastName=?,phoneNumber=? where id=?`
    db.pool.execute(statement,[firstName,lastName,phone,request.userId],
        (error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


router.post('/login',(request,response)=>{
    console.log("Inside register");
    const {email,password}=request.body 
    const statement=`select id,firstName,lastName,phoneNumber,isDeleted from user where email=? and password=?;`
    const encryptedPassword=String(crypto.SHA256(password))
    db.pool.query(statement,[email,encryptedPassword],(error,users)=>{
        if(error){
            response.send(utils.createErrorResult(error))
        } else{
            if(users.length==0){
                response.send(utils.createErrorResult('user does not exist'))
            }else{
                console.log("* ",users)
                const user=users[0]
                console.log("** ",users[0]);
                if(user.isDeleted){
                    response.send(utils.createErrorResult('your account is closed'))
                }else{
                    const payload={id:user.id}
                    const token=jwt.sign(payload,config.secret)
                    console.log("*** ",token)
                    const userData={
                        token,
                        name:`${user['firstName']} ${user['lastName']}`,

                    }
                    response.send(utils.createSuccessResult(userData))
                }
            }
        }
    })
})



module.exports=router