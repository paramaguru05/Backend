const express = require("express")
const app = express()
const cors = require("cors")
const BCARouter = require("./router/bcaRouter")
const csRouter = require("./router/csRouter")
const libraryRouter = require("./router/libraryRouter")
const adminRoute = require("./router/adminRouter")
const GEH = require("./utils/globalErrorHandler")

app.use( express.json())


app.use( cors() )

app.get("/",(req,res,)=>{
    res.send({data:"Home page"})
})

app.use("/api/v1/admins",adminRoute)
app.use("/api/v1/BCA/",BCARouter)
app.use("/api/v1/CS/",csRouter)
app.use("/api/v1/library",libraryRouter)

app.all("*",(req,res,next)=>{
    console.log("affter excute 2")
    let err = new Error("Can not find this url",req.url)
    console.log( req.url )
    err.status = "Faills"
    err.statusCode = 404
    next( err )
})

app.use(GEH)

module.exports = app