const applications=require('../Models/applicationModel')

exports.addApplication=async(req,res)=>{
    try{
        const {fullname,qualification,email,phone,coverletter,jobId,jobTitle}=req.body

        // Guard: resume file is required
        if(!req.file){
            return res.status(400).json("Please upload a valid PDF resume.")
        }

        const resume=req.file.filename

        if(!fullname||!qualification||!email||!phone||!coverletter||!jobId||!jobTitle){
            return res.status(400).json("All fields are required.")
        }

        const existingApplication=await applications.findOne({email,jobId})
        if(existingApplication){
            return res.status(400).json("You have already applied for this position.")
        }

        const newApplication=new applications({
            fullname,qualification,email,phone,coverletter,jobId,jobTitle,resume
        })
        await newApplication.save()
        res.status(200).json(newApplication)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err.message||err)
    }
}

//ADMIN
exports.listApplications=async(req,res)=>{
    try{
        const applicationList=await applications.find()
        res.status(200).json(applicationList)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err.message||err)
    }
}