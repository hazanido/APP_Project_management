const UserModel = require('../Model/userModel');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userModel = new UserModel();
const secretKey = process.env.JWT_SECRET || 'your_fallback_secret_key'; 

const handleErrorResponse = (res, status, message, error) => {
    res.status(status).send({ message, error: error?.message });
};

const createUser = async (req, res) => {
    try {
        const { id, name, email, password, age, taskId, projectId, messageId } = req.body;

        
        await userModel.createUser({
            id,
            name,
            email,
            password,
            age,
            taskId,
            projectId,
            messageId
        });

        
        res.status(201).send({ message: 'User created successfully' });
        console.log('User created successfully');
    } catch (error) {
        handleErrorResponse(res, 400, 'Error creating user', error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('email: ', req.body.email);

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }


        const validPassword = await userModel.verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });


        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            userId: user.id 
          });
          
    } catch (error) {
        res.status(500).send({ message: 'Login failed', error });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body; 
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

      
        let user = await userModel.findUserByEmail(email);
        
        
        if (!user) {
            user = await userModel.createUser({
                id: googleId,
                name,
                email,
                password: null, 
                age: null,
                taskId: [],
                projectId: [],
                messageId: [],
            });
        }


        const jwtToken = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login successful', token: jwtToken });
    } catch (error) {
        res.status(500).send({ message: 'Google login failed', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('userId: ', userId);
        const user = await userModel.getUserById(userId);

        if (!user) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        res.status(200).send(user);
    } catch (error) {
        handleErrorResponse(res, 500, 'Error fetching user', error);
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;  
        const updatedUserData = req.body;

        if (req.user.id !== userId) {
            return handleErrorResponse(res, 403, 'You are not allowed to update this profile');
        }

        
        const existingUser = await userModel.getUserById(userId);
        if (!existingUser) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        await userModel.updateUser({ id: userId, ...updatedUserData });

        res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        handleErrorResponse(res, 500, 'Error updating user', error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const existingUser = await userModel.getUserById(userId);
        if (!existingUser) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        await userModel.deleteUser(userId);

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, 500, 'Error deleting user', error);
    }
};


module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    googleLogin
};
