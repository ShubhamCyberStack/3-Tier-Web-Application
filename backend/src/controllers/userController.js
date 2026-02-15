module.exports = (sequelize) => {
  const User = require("../models/User")(sequelize);

  return {
    register: async (req, res) => {
      try {
        console.log("Register request body:", req.body);
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
          console.error("Registration failed: Missing fields");
          return res.status(400).json({ error: "Name, email, and password are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          console.error("Registration failed: Email already registered");
          return res.status(400).json({ error: "Email already registered." });
        }

        // Password hashing should be here (for demo: plain, but use bcrypt in production!)
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password /* use hashedPassword in prod */ });
        console.log("User registered:", user.email);

        // (Optional) Don't return password in response
        user.password = undefined;

        return res.status(201).json({ message: "Registration successful", user });
      } catch (err) {
        // Log the error for debugging
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal server error", detail: err.message });
      }
    },

    login: async (req, res) => {
      // usual login code
    }
  };
};
