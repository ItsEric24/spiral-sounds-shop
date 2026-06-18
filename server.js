import express from 'express'
import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'

const app = express()


app.use(express.static("public"))
app.use(express.json()) 

app.use("/api/products", productsRouter)
app.use("/api/auth",authRouter)

app.listen(4000, ()=>{
    console.log(`Server running at http://localhost:4000`)  
})