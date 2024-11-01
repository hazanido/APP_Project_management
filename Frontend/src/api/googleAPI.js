import axios from './backendAPI';

export const googleLogin = async (code) => {
  try {
    const response = await axios.post('/users/google-login', { code });
    return response.data;
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error;
  }
};



