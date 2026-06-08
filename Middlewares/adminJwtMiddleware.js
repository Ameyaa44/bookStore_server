const jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req, res, next) => {
    try {
        console.log("Request hit  at jwt Middleware")
        const token = req?.headers?.authorization?.split(" ")[1]
        const decode_value = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode_value)
        req.payload = decode_value.email
        req.role = decode_value.role
        if (decode_value.role !== "admin") {
            res.status(406).json("invalid user.user should be admin!")
        }
        else{
            next()
        }
    }
    catch (err) {
            console.log(err)
            res.status(404).json("Invalid Token")
        }
    }

module.exports = adminJwtMiddleware