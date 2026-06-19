import { validateUser } from "../utils/validation.js";


export async function registerUser(req, res) {
  let { name, username, email, password } = req.body;
  let usernamePattern = /^[a-zA-Z0-9_-]{1,20}$/;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "Please include all fields" });
  }

  if (!usernamePattern.test(username)) {
    return res
      .status(400)
      .json({ error: 'Username must be 1–20 characters, using letters, numbers, _ or -.'  });  
  }

  const emailData = {email}
  const validation = validateUser(emailData)

  if(validation.fails()){
    return res.status(400).json({error: "Invalid Email format"})
  }

  console.log(req.body) 

}
