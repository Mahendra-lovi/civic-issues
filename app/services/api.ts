// services/api.ts
import * as SecureStore from "expo-secure-store";

const API_URL = "http://10.215.214.2:5000"; // replace with your backend host

// --- Token helpers ---
async function getToken() {
  return await SecureStore.getItemAsync("sb_token");
}

// Define the file object type for better type safety
type FileObject = {
  uri: string;
  name: string;
  type: string;
};

// Upload issue to backend
export async function uploadIssue({
  imageUri,
  audioUri,
  text,
  category,
  location,
}: {
  imageUri: string;
  audioUri?: string;
  text?: string;
  category: string;
  location: { latitude: number; longitude: number; address?: string };
}) {
  const token = await getToken();
  if (!token) throw new Error("User not logged in");

  const formData = new FormData();

  // Create a robust file name and type
  const getImageNameAndType = (uri: string): { name: string; type: string } => {
    const filename = uri.split("/").pop()!;
    const fileExtension = filename.split(".").pop();
    const mimeType = `image/${fileExtension === "png" ? "png" : "jpeg"}`;
    return { name: filename, type: mimeType };
  };

  const { name: imageName, type: imageType } = getImageNameAndType(imageUri);

  // Append image with correct typing
  formData.append("image", {
    uri: imageUri,
    type: imageType,
    name: imageName,
  } as unknown as Blob);

  // Append audio if provided
  if (audioUri) {
    const audioName = audioUri.split("/").pop()!;
    const audioType = "audio/m4a"; // adjust if needed
    formData.append("audio", {
      uri: audioUri,
      type: audioType,
      name: audioName,
    } as unknown as Blob);
  }

  if (text) formData.append("text", text);
  formData.append("category", category);
  formData.append("latitude", location.latitude.toString());
  formData.append("longitude", location.longitude.toString());
  if (location.address) formData.append("address", location.address);

  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send Supabase token
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data.record; // Assuming backend returns created record
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Fetch issues from DB
export async function fetchIssues() {
  const token = await getToken();
  if (!token) throw new Error("User not logged in");

  try {
    const res = await fetch(`${API_URL}/api/messages`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send Supabase token
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Could not fetch issues");
    }

    return data.data; // Return the array of issues
  } catch (error) {
    console.error("Fetch issues error:", error);
    throw error;
  }
}
