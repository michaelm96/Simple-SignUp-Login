const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

const bcryptPass = (password) =>{
    return bcrypt.hashSync(password, parseInt(saltRounds));
}

module.exports = { 
    bcryptPass
}