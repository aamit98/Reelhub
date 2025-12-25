// API Configuration with platform-aware defaults
import Constants from "expo-constants";
import { Platform } from "react-native";

// Platform-specific dev hosts
// Android emulator uses 10.0.2.2 to access host machine's localhost
// iOS simulator uses localhost directly
const getDevHost = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
};

// Get API base URL from config or use defaults
const getApiBaseUrl = () => {
  // First check if it's set in app.config.js extra.apiBaseUrl
  const configUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  
  if (configUrl && typeof configUrl === "string" && configUrl.trim() !== "") {
    const url = configUrl.trim();
    const finalUrl = url.endsWith("/api") ? url : `${url}/api`;
    console.log(`[API] Using configured base URL: ${finalUrl}`);
    return finalUrl;
  }
  
  // Fallback to environment-aware defaults
  if (__DEV__) {
    const host = getDevHost();
    const finalUrl = `${host}/api`;
    console.log(`[API] Using platform-aware base URL: ${finalUrl}`);
    return finalUrl;
  }
  
  // Production fallback
  return "https://your-production-api.com/api";
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token from storage
const getToken = async () => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    // Silent error handling
    return null;
  }
};

// Helper function to save auth token
const saveToken = async (token) => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    // Silent error handling
  }
};

// Helper function to remove auth token
const removeToken = async () => {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    // Silent error handling
  }
};

// API request helper with timeout
const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Create timeout promise (10 seconds)
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout - server may be offline')), 10000);
  });

  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}${endpoint}`, config),
      timeoutPromise
    ]);

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error('Server returned non-JSON response. Check if backend is running correctly.');
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || 'Request failed');
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Provide more helpful error messages
    if (error.message.includes('timeout')) {
      throw new Error('Connection timeout - Check if backend server is running on port 3000');
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
      throw new Error('Cannot connect to server - Make sure backend is running and IP address is correct');
    }
    if (error.message.includes('JSON')) {
      throw new Error('Server error - Backend may be returning HTML instead of JSON. Check backend logs.');
    }
    throw error;
  }
};

// Auth API
export const createUser = async (email, password, username) => {
  try {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });

    // Save token
    if (response.token) {
      await saveToken(response.token);
    }

    return response.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Save token
    if (response.token) {
      await saveToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await apiRequest('/auth/me');
    return user;
  } catch (error) {
    // Return null instead of throwing if user is not authenticated
    if (error.status === 401 || error.message.includes('token')) {
      return null;
    }
    // For network errors, return null to allow app to continue
    if (error.message.includes('timeout') || error.message.includes('connect')) {
      return null;
    }
    throw error;
  }
};

export const signOut = async () => {
  await removeToken();
};

// Video API
export const getVideos = async (searchQuery = '') => {
  try {
    const query = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '';
    return await apiRequest(`/videos${query}`);
  } catch (error) {
    throw error;
  }
};

// Upload file to server
export const uploadFile = async (fileUri) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'file';
    const match = /\.(\w+)$/.exec(filename);
    let type = 'application/octet-stream';
    
    if (match) {
      const ext = match[1].toLowerCase();
      if (ext === 'mp4' || ext === 'mov' || ext === 'avi' || ext === 'webm') {
        type = `video/${ext === 'mov' ? 'quicktime' : ext}`;
      } else if (ext === 'jpg' || ext === 'jpeg') {
        type = 'image/jpeg';
      } else if (ext === 'png') {
        type = 'image/png';
      } else if (ext === 'gif') {
        type = 'image/gif';
      }
    }
    
    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: type,
    });

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Create video
export const createVideo = async (videoData) => {
  try {
    // Upload video and thumbnail files first if they're local files
    let videoUrl = videoData.video?.uri || videoData.video;
    let thumbnailUrl = videoData.thumbnail?.uri || videoData.thumbnail;

    // Check if they're local file URIs (file:// or content://)
    if (videoUrl && typeof videoUrl === 'string' && (videoUrl.startsWith('file://') || videoUrl.startsWith('content://'))) {
      try {
        const videoUpload = await uploadFile(videoUrl);
        videoUrl = videoUpload.url;
      } catch (uploadError) {
        throw new Error(`Failed to upload video: ${uploadError.message || 'Upload error'}`);
      }
    }

    if (thumbnailUrl && typeof thumbnailUrl === 'string' && (thumbnailUrl.startsWith('file://') || thumbnailUrl.startsWith('content://'))) {
      try {
        const thumbnailUpload = await uploadFile(thumbnailUrl);
        thumbnailUrl = thumbnailUpload.url;
      } catch (uploadError) {
        throw new Error(`Failed to upload thumbnail: ${uploadError.message || 'Upload error'}`);
      }
    }

    // Now create the video with the uploaded URLs
    return await apiRequest('/videos', {
      method: 'POST',
      body: JSON.stringify({
        title: videoData.title,
        prompt: videoData.prompt,
        video: videoUrl,
        thumbnail: thumbnailUrl,
      }),
    });
  } catch (error) {
    throw error;
  }
};

// User API
export const getUserById = async (userId) => {
  try {
    return await apiRequest(`/users/${userId}`);
  } catch (error) {
    throw error;
  }
};

// Get user's videos
export const getUserVideos = async (userId) => {
  try {
    return await apiRequest(`/videos?creator=${userId}`);
  } catch (error) {
    throw error;
  }
};

// Bookmark API
export const getBookmarks = async () => {
  try {
    return await apiRequest('/bookmarks');
  } catch (error) {
    throw error;
  }
};

export const addBookmark = async (videoId) => {
  try {
    return await apiRequest(`/bookmarks/${videoId}`, {
      method: 'POST',
    });
  } catch (error) {
    throw error;
  }
};

export const removeBookmark = async (videoId) => {
  try {
    return await apiRequest(`/bookmarks/${videoId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
};

export const checkBookmark = async (videoId) => {
  try {
    const result = await apiRequest(`/bookmarks/check/${videoId}`);
    return result.bookmarked;
  } catch (error) {
    return false;
  }
};

// Comments API
export const getComments = async (videoId) => {
  try {
    return await apiRequest(`/comments/${videoId}`);
  } catch (error) {
    throw error;
  }
};

export const createComment = async (videoId, text) => {
  try {
    return await apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify({ video: videoId, text }),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    return await apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
};

export const likeComment = async (commentId) => {
  try {
    return await apiRequest(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  } catch (error) {
    throw error;
  }
};

// Video Likes API
export const likeVideo = async (videoId) => {
  try {
    return await apiRequest(`/videos/${videoId}/like`, {
      method: 'POST',
    });
  } catch (error) {
    throw error;
  }
};

export const checkVideoLike = async (videoId) => {
  try {
    const result = await apiRequest(`/videos/${videoId}/like/check`);
    return result.liked || false;
  } catch (error) {
    return false;
  }
};

// User Profile API
export const updateUserProfile = async (userId, profileData) => {
  try {
    return await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  } catch (error) {
    throw error;
  }
};

// Trending Videos API
export const getTrendingVideos = async () => {
  try {
    return await apiRequest('/videos/trending');
  } catch (error) {
    throw error;
  }
};

// Search API (enhanced)
export const searchVideos = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({ query, ...filters });
    return await apiRequest(`/videos/search?${params.toString()}`);
  } catch (error) {
    throw error;
  }
};

// Delete video (owner only)
export const deleteVideo = async (videoId) => {
  try {
    return await apiRequest(`/videos/${videoId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
};

