const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const generateToken = (user) =>{
    return jwt.sign(
        { id:user.id, email: user.email, name: user.name }, 
         secretKey
    )
}

module.exports = { 
    generateToken
}