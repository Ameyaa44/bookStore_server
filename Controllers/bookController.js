const books=require('../Models/bookModel')
const stripe=require('stripe')(process.env.STRIPE_SECRET)

exports.addBook=async(req,res)=>{
    // console.log("Add Book API")
    try{
    const {title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,isbn,category}=req.body
    const uploadImg=[]
    const userMail=req.payload
    console.log(req.files)
    req.files.map(item=>uploadImg.push(item.filename))
    console.log(title,author,noOfPages,image,price,discountPrice,abstract,publisher,
        language,isbn,category,uploadImg,userMail)
    // console.log(req.body)
    // console.log(req.files)
    console.log(uploadImg)
    const existingBook=await books.findOne({userMail,title})
    console.log(existingBook)
    if(existingBook){
        res.status(401).json("You have already Added the book!")
    }
    else{
        const newBook=new books({
            title,author,noOfPages,image,price,discountPrice,abstract,
            publisher,language,isbn,category,uploadImg:uploadImg,userMail
        })
        await newBook.save()
        res.status(200).json("Book Added Succesfully!")
    }
}
catch(err){
    console.log(err)
    res.status(500).json(err)
}
}

// All Books
// exports.allBookList=async(req,res)=>{
//     try{
//         const userMail=req.payload
//         const booklist=await books.find({userMail:{$ne:userMail}})
//         res.status(200).json(booklist)
//     }
//     catch (err){
//         console.log(err)
//         res.status(500).json(err)
//     }
// }

exports.allBookList = async (req, res) => {
    try {
        const userMail = req.payload
        const {search}=req.query
        console.log(search)
        let filter={}
        search ? filter ={userMail:{$ne:userMail}, title:{$regex:search , $options:'i'}} : 
                filter={userMail:{$ne:userMail}}
        const booklist = await books.find(filter)              
        res.status(200).json(booklist)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

// fetch book document by id
exports.getBookById=async(req,res)=>{
    try{
        const {bid}=req.params
        const bookData=await books.findById(bid)
        res.status(200).json(bookData)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)

    }
}

exports.latestBooksList = async (req, res) => {
    try {
        const booklist = await books.find({ userMail: { $ne: req.payload } })
            .sort({ _id: -1 })
            .limit(4)
       res.status(200).json(booklist)
    } catch (err) {
        res.status(500).json(err)
    }
}

//fetch books added by authorised user
exports.getUserBooks=async(req,res)=>{
    try{
        const usermail=req.payload
        const booklist=await books.find({userMail:usermail})
        res.status(200).json(booklist)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//delete book by user
exports.deleteBookById=async(req,res)=>{
    try{
        const {bid}=req.params
        const deletebook=await books.findByIdAndDelete(bid)
        res.status(200).json("Book Deleted Succesfully")
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

// booklist purchased by user
exports.getBoughtBooks=async(req,res)=>{
    try{
        const usermail=req.payload
        const boughtbooklist=await books.find({bought:usermail})
        res.status(200).json(boughtbooklist)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

exports.purchaseBookStripe=async(req,res)=>{
    try{
        console.log("Inside purchase book-stripe controller")
        const {_id,title,author,noOfPages,image,price,discountPrice,abstract,publisher,isbn,language,category,uploadImg,userMail}=req.body
        const email=req.payload
        const updateBook=await books.findByIdAndUpdate({_id},{
            title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,category,isbn,uploadImg,userMail,
            status:'sold',bought:email
        },{new:true})  
        // checkout session
        const line_items=[{
            price_data:{
                currency:'usd',
                product_data:{
                    name:'title',
                    images:[image],
                    description:`${author} | ${publisher}`
                },
                unit_amount:Math.round(discountPrice*100)
            },
            quantity:1
        }]
        const metadata={
            title,author,noOfPages,image,price,discountPrice,abstract,publisher,language,category,isbn,uploadImg,userMail,
            status:'sold',bought:email
        }
        const session=await stripe.checkout.sessions.create({
            success_url:"http://localhost:5173/payment-success",
            cancel_url:"http://localhost:5173/payment-error",
            payment_method_types:['card'],
            line_items,
            mode:'payment'
        }) 
        // console.log(session)
        res.status(200).json({checkoutPaymentUrl:session?.url})
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

// Admin related book APIs
exports.getAdminAllBooks=async(req,res)=>{
    try{
        const booklist=await books.find()
        res.status(200).json(booklist)
    }
    catch{
        console.log(err)
        res.status(500).json(err)
    }
}

exports.approveBook=async(req,res)=>{
    try{
        const {bid}=req.params
        const updatedBook=await books.findByIdAndUpdate(bid,{status:"approved"},{new:true})
        updatedBook.save()
        res.status(200).json(updatedBook)
    }
    catch{
        console.log(err)
        res.status(500).json(err)
    }
}

