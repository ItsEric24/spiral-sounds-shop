import { db } from "../db/db.js";

export async function getGenres(req, res) {
  try {
    const getGenres = db.prepare("SELECT genre FROM products");
    const genreRows = getGenres.all();
    const genres = [];

    for (const { genre } of genreRows) {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    }

    res.status(200).json(genres);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch genres", details: error.message });
  }
}

export async function getProducts(req, res) {
  const { genre, search } = req.query;
  try {
    if (genre) {
      const getProductsPerQuery = db
        .prepare(`SELECT * FROM products WHERE genre = ?`)
        .all(genre);
      return res.status(200).json(getProductsPerQuery);
    }

    if (search) {
      const value = `%${search}%`
      const getProductsBySearch = db.prepare(`
         SELECT * FROM products WHERE title LIKE ? OR
         artist LIKE ? OR genre LIKE ?
        `).all(value, value, value)         

      return res.status(200).json(getProductsBySearch)
    }

    const getProductsData = db.prepare("SELECT * FROM products");
    const productRows = getProductsData.all();

    res.status(200).json(productRows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", details: error.message });
  }
}
