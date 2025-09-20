// controllers/auth.js
import  supabase  from "../supabase.js";

// ---------- SIGN UP ----------
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Sign-up successful! Check your email for confirmation.",
      user: data.user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ---------- SIGN IN ----------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({
      message: "Sign-in successful!",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
