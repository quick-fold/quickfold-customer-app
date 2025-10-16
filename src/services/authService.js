import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await ApiService.login(email, password);
      
      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async register(userData) {
    try {
      const response = await ApiService.register(userData);
      
      if (response.success) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async logout() {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored data regardless of API call success
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
  }

  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  async getStoredToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Get stored token error:', error);
      return null;
    }
  }

  async isAuthenticated() {
    try {
      const token = await this.getStoredToken();
      const user = await this.getStoredUser();
      return !!(token && user);
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }

  async refreshUserData() {
    try {
      const response = await ApiService.getCurrentUser();
      
      if (response.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return null;
    }
  }
}

export default new AuthService();

