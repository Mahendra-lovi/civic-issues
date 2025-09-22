// services/api.ts
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config";
// const API_URL = "http://192.168.0.183:5000"; // replace with your backend host

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
console.log('Posting to URL:', `${API_URL}/api/upload`);
  try {
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ send Supabase token
      },
      body: formData,
    });

      const ct = res.headers.get("content-type") || "";
  const raw = await res.clone().text(); // Get raw response for debugging
  
  if (!ct.includes("application/json")) {
    console.log("uploadIssue non-JSON response:", res.status, raw);
    throw new Error(`Upload failed: expected JSON but got ${ct} (status ${res.status})`);
  }
    const data = await res.json();
    if (!res.ok) {
      console.log('Upload failed with JSON response:', data);
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

  // 🚨 ADD DEFENSIVE PARSING HERE TOO
  const ct = res.headers.get("content-type") || "";
  const raw = await res.clone().text();
  
  if (!ct.includes("application/json")) {
    console.log("fetchIssues non-JSON response:", res.status, raw);
    throw new Error(`Fetch failed: expected JSON but got ${ct} (status ${res.status})`);
  }

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
