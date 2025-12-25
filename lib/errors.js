// Error normalization helper for consistent user-facing error messages
export function toUserMessage(err) {
  const msg = err?.message ?? "Unknown error";
  
  // Network errors
  if (msg.includes("timeout")) {
    return "Server timeout. Is the backend running?";
  }
  if (msg.includes("Network request failed") || msg.includes("Failed to fetch") || msg.includes("connect")) {
    return "No connection to server. Please check your connection.";
  }
  
  // Server errors
  if (msg.includes("JSON") || msg.includes("non-JSON")) {
    return "Server error - Backend may be returning HTML instead of JSON. Check backend logs.";
  }
  if (msg.includes("500") || msg.includes("Internal Server Error")) {
    return "Server error occurred. Please try again later.";
  }
  
  // Auth errors
  if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("token")) {
    return "Please sign in to continue.";
  }
  if (msg.includes("403") || msg.includes("Forbidden")) {
    return "You don't have permission to perform this action.";
  }
  
  // Not found
  if (msg.includes("404") || msg.includes("Not Found")) {
    return "The requested resource was not found.";
  }
  
  // Validation errors
  if (msg.includes("Invalid") || msg.includes("invalid")) {
    return msg; // Keep validation errors as-is
  }
  
  // Return the original message if no match
  return msg;
}


