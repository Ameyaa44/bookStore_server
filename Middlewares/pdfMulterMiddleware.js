const multer=require('multer')
const jwtMiddleware = require('./jwtMiddleware')
const fs = require('fs')

// Ensure directory exists
if (!fs.existsSync('./resumeFiles')) {
    fs.mkdirSync('./resumeFiles', { recursive: true })
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./resumeFiles')
    },
    filename:(req,file,cb)=>{
        const filename=`Image-${Date.now()}-${file.originalname}`
        cb(null,filename)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="application/pdf"){
        cb(null,true)
    }
    else{
        cb(null,false)
    } 
}

const pdfmulterConfig=multer({
    storage,
    fileFilter
})

module.exports=pdfmulterConfig