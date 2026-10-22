// src/auth/authHelpers.js
// Utility helpers for authentication

export function formatPhoneNumberE164(phone) {
  if (!phone) return "";
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "+234" + cleaned.slice(1);
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+234" + cleaned;
  }
  return cleaned;
}

export function getFriendlyErrorMessage(err) {
  if (!err) return "An error occurred. Please try again.";
  const code = err.code || "";
  const msg = err.message || "";

  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists. Please log in.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (
    code === "auth/user-not-found" ||
    code === "auth/wrong-password" ||
    code === "auth/invalid-credential"
  ) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (code === "auth/network-request-failed") {
    return "Network connection issue. Please check your internet.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again in a moment.";
  }
  return msg || "Authentication failed. Please try again.";
}
