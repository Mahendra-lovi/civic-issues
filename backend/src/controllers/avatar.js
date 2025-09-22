import supabase from "../supabase.js";
export async function getAvatarUrl(req, res) {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: "Missing path" });

    const { data, error } = await supabase
      .storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60);

    if (error) throw error;

    res.json({ signedUrl: data.signedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
