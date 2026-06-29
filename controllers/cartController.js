import { db } from "../db/db.js";

export async function addToCart(req, res) {
  const { productId } = req.body;
  const userId = req.session.userId;

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const cartItem = db
    .prepare("SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?")
    .get(productId, userId);

  if (cartItem) {
    db.prepare(
      "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
    ).run(1, cartItem.id);
  } else {
    db.prepare(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
    ).run(userId, productId);
  }

  res.status(200).json({ message: "Added to cart" });
}

export async function getCartCount(req, res) {
  const userId = req.session.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Not signed in, please sign in to use the cart" });
  }

  const cartCount = db
    .prepare(
      `SELECT SUM(quantity) AS cartCount FROM cart_items WHERE user_id = ?`,
    )
    .get(userId);

  res.status(200).json({ totalItems: cartCount.cartCount || 0 });
}

export async function getAllItems(req, res) {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(400).json({ error: "Not logged in" });
  }

  const allCartItems = db
    .prepare(
      `SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = ?`,
    )
    .all(userId);

  res.status(200).json({ items: allCartItems });
}


export async function deleteCartItem(req, res) {
  const userId = req.session.userId
  const itemId = parseInt(req.params.itemId, 10)

  if(isNaN(itemId)){
    return res.status(400).json({error: 'Invalid item ID'})
  }

  db.prepare(`DELETE FROM cart_items WHERE id = ? AND user_id = ?`).run(itemId, userId)

  res.status(204).end()
}

export async function deleteAllCartItems(req, res) {
  const userId = req.session.userId
  db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(userId)

  res.status(204).end()
  
}
