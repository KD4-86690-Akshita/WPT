const express= require('express')
const db=require('../db')
const utils=require('../utils')

//import multer
const multer=require('multer')

//create object to upload the file
//the upload here is a middleware
const upload=multer({dest :'image'})
const router = express.Router()

router.get('/',(request,response)=>{
    const statement=`select id,title,details,image from category;`
    db.pool.query(statement,(error,categories)=>{
        response.send(utils.createResult(error,categories))
    })
})

router.post('/',upload.single('icon'),(request,response)=>{
    const {title,details}=request.body
    //console.log("title and details are ",title,details);

    const fileName=request.file.filename
    //console.log("$ ",fileName);
    const statement=`insert into category (title,details,image) values (?,?,?)`
    db.pool.execute(
        statement,[title,details,fileName],
        (error,categories)=>{
            response.send(utils.createResult(error,categories))
        }
    )
})

module.exports=router