const express=require('express')
const fs=require('node:fs')

const router = express.Router()


router.get('/:imageName',(request,response)=>{
    const {imageName}=request.params
    console.log(request.params)
    const path=__dirname+'/../image/'+imageName
    const data=fs.readFileSync(path)
    response.send(data)

})

module.exports=router
