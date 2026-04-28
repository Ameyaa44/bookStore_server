const jobs=require('../Models/jobModel')

// add job post
exports.addJobPost=async(req,res)=>{
    try{
        const {title,location,jobType,salary,qualification,experience,description}=req.body
        const existingJob=await jobs.findOne({title:title,location:location})
        if(existingJob){
            res.status(400).json("Job Already Posted!")
        }
        else{
            const newJob=new jobs({title,location,jobType,salary,qualification,experience,description})
            await newJob.save()
            res.status(200).json(newJob)
        }
    }
    catch{
        console.log(err)
        res.status(500).json(err)
    }
}

// list job posts
exports.listJobPosts=async(req,res)=>{
    try{
        const {search} = req.query
        console.log(search)
        let filter={}
        search ? filter ={title:{$regex:search , $options:'i'}} : 
                filter={ }
        const joblist = await jobs.find(filter)              
        res.status(200).json(joblist)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

// remove job post
exports.deleteJobPost=async(req,res)=>{
    try{
        const {jid}=req.params
        const jobpost=await jobs.findByIdAndDelete(jid)
        res.status(200).json(jobpost)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
