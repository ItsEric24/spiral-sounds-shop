import express from "express"
import { addToCart, deleteAllCartItems, deleteCartItem, getAllItems, getCartCount } from "../controllers/cartController.js"


export const cartRouter = express.Router()

cartRouter.get("/", getAllItems)
cartRouter.post("/add", addToCart)
cartRouter.get("/cart-count", getCartCount)
cartRouter.delete("/all", deleteAllCartItems)
cartRouter.delete("/:itemId", deleteCartItem)

