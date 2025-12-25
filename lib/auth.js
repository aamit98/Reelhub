import { ID } from 'react-native-appwrite';
import { account, databases, appwriteConfig } from './appwrite';

/**
 * Creates a new user account
 */
export async function createUser(email, password, username) {
    try {
        // Create account
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Account creation failed');

        // Create user document in database
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
            }
        );

        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Signs in a user
 */
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

/**
 * Signs out the current user
 */
export async function signOut() {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Gets the current user
 */
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}






