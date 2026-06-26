import { db } from "../db/db.js";
import { validateUser } from "../utils/validation.js";
import bcrypt from "bcrypt";

export async function registerUser(req, res) {
  let { name, username, email, password } = req.body;
  let usernamePattern = /^[a-zA-Z0-9_-]{1,20}$/;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "Please include all fields" });
  }

  if (!usernamePattern.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 1–20 characters, using letters, numbers, _ or -.",
    });
  }

  const emailData = { email };
  const validation = validateUser(emailData);

  if (validation.fails()) {
    return res.status(400).json({ error: "Invalid Email format" });
  }

  try {
    const isUserExist = db
      .prepare(`SELECT id FROM users WHERE name = ? OR email = ?`)
      .get(name, email);

    if (isUserExist) {
      return res
        .status(400)
        .json({ error: "Email or username already in use" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const insertUser = db.prepare(
      "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
    );

    const result = insertUser.run(name, username, email, hashPass);
    req.session.userId = result.lastInsertRowid;

    res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.error("Registration error", error.message);
    res.status(500).json({ error: "Registration failed. Please try again" });
  }
}

export async function loginUser(req, res) {
  const {username, password} = req.body

  if(!username || !password){
    return res.status(400).json({error: "All fields are required"})
  }

  try {
    const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get(username)

    if(!userExists){
      return res.status(400).json({error: "Invalid credentials"})
    }

    const checkPassword = await bcrypt.compare(password, userExists.password)

    if(!checkPassword){
      return res.status(400).json({error: "Invalid credentials"})
    }

    req.session.userId = userExists.id
    res.status(200).json({message: "Logged in"})

  } catch (error) {
    
  }
}


export async function logoutUser(req, res){
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).json({error: "Couldn't logout"})
    }

    res.redirect("/")
  })
}
