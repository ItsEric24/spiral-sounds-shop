import { DatabaseSync } from "node:sqlite";
import { vinyl } from "./data.js";

function seedDatabaseTable() {
  const db = new DatabaseSync("database.db");

  const insert = db.prepare(
    "INSERT INTO products (title, artist, price, image, year, genre, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  for(const {title, artist, price, image, year, genre, stock} of vinyl){
    insert.run(title, artist, price, image, year, genre, stock)
  }

  db.close()
  console.log("All records inserted successfully");
  
}

seedDatabaseTable()
