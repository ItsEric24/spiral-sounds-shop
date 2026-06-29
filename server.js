import express from 'express'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'
import session from "express-session"
import dotenv from "dotenv"
import { meRouter } from './routes/me.js'
import { cartRouter } from './routes/cart.js'

const app = express()
dotenv.config()

app.use(express.static("public"))
app.use(express.json())
app.use(session({
    secret: process.env.SPIRAL_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}))

app.use("/api/products", productsRouter)
app.use("/api/auth/me", meRouter)
app.use("/api/auth",authRouter)
app.use("/api/cart", cartRouter)

app.listen(4000, ()=>{
    console.log(`Server running at http://localhost:4000`)  
})