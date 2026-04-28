const applications=require('../Models/applicationModel')

exports.addApplication=async(req,res)=>{
    try{
        const {fullname,qualification,email,phone,coverletter,jobId,jobTitle}=req.body
        const resume=req.file?.filename
        const existingApplication=await applications.findOne({email,jobId})
        if(existingApplication){
            res.status(400).json("Application already Exixst")
        }
        else{
            const newApplication=new applications({
                fullname,qualification,email,phone,coverletter,jobId,jobTitle,resume
            })
            await newApplication.save()
            res.status(200).json(newApplication)
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//ADMIN
exports.listApplications=async(req,res)=>{
    try{
        const applicationList=await applications.find()
        res.status(200).json(applicationList)
    }
    catch{
        console.log(err)
        res.status(500).json(err)
    }
    
}