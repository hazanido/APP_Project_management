import axios from './backendAPI'; 

export const googleLogin = async (token) => {
  try {
    const response = await axios.post('/users/google-login', { token });
    
    return response.data; 
  } catch (error) {
    console.error('Error during Google login:', error);
    throw error; 
  }
};
