// Re-export API functions for backward compatibility
// This file now uses our custom backend instead of Appwrite
import * as api from './api.js';

export const createUser = async (email, password, username) => {
    try {
        console.log('Creating account for:', email);
        const user = await api.createUser(email, password, username);
        console.log('Account created successfully:', user.$id);
        return user;
    } catch (error) {
        console.log('createUser error:', error);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const response = await api.signIn(email, password);
        return response;
    } catch (error) {
        console.log('signIn error:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await api.getCurrentUser();
        return user;
    } catch (error) {
        console.log('getCurrentUser error:', error);
        throw error;
    }
};

// Export video functions
export const getVideos = api.getVideos;
export const createVideo = api.createVideo;
export const getUserById = api.getUserById;
export const signOut = api.signOut;

// Export bookmark functions
export const getBookmarks = api.getBookmarks;
export const addBookmark = api.addBookmark;
export const removeBookmark = api.removeBookmark;
export const checkBookmark = api.checkBookmark;




