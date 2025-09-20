// services/authStorage.ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "sb_token";

// Save Supabase session token
export async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (err) {
    console.error("Error saving token:", err);
  }
}

// Get Supabase session token
export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error("Error getting token:", err);
    return null;
  }
}

// Remove token (useful for logout)
export async function removeToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error("Error removing token:", err);
  }
}
