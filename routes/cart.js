import express from "express"
import { addToCart, deleteAllCartItems, deleteCartItem, getAllItems, getCartCount } from "../controllers/cartController.js"
import { requireAuth } from "../middleware/requireAuth.js"


export const cartRouter = express.Router()

cartRouter.get("/", requireAuth, getAllItems)
cartRouter.post("/add", requireAuth, addToCart)
cartRouter.get("/cart-count", requireAuth, getCartCount)
cartRouter.delete("/all", requireAuth, deleteAllCartItems)
cartRouter.delete("/:itemId", requireAuth, deleteCartItem)

