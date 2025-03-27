const jwt = require("jsonwebtoken")

class JWTFeatures {
    constructor(db){
        this.db = db
    }

    signToken(id){
       return jwt.sign({id},process.env.SECRTE_STR,{
            expiresIn:"1d"
        })
    }

    verifyToken(token){
        let decode = jwt.verify(token,process.env.SECRTE_STR)
        const {id} = decode
        this.db =  this.db.findOne({_id:id})
        return this
    }

}

module.exports = JWTFeatures