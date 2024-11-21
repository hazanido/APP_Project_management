const UserModel = require('../Model/userModel');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const axios = require('axios');


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
        
        console.log('email: ', email);
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            
            return res.status(401).send({ message: 'Invalid email or password' });
        }


        const validPassword = await userModel.verifyPassword(password, user.password);
        if (!validPassword) {
            console.log('email: ', req.body.email);
            return res.status(401).send({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });


        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            userId: user.id ,
            email: user.email
          });
          
    } catch (error) {
        res.status(500).send({ message: 'Login failed', error });
    }
};


const googleLogin = async (req, res) => {
    try {
        // console.log('Google login request:', req.body.data);
        
        
        const { code } = req.body;
        console.log('Google login request111111111111111111:', code);
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,  
            grant_type: 'authorization_code',
        });

        const { id_token, access_token } = tokenResponse.data;
        const ticket = await client.verifyIdToken({
            idToken: id_token,
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
        console.error('Google login failed:', error);
        res.status(500).send({ message: 'Google login failed', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
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
const addProjectToUserByEmail = async (req, res) => {
    try {
        const { email, projectId } = req.body;
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.projectId.includes(projectId)) {
            user.projectId.push(projectId);
            await userModel.updateUser(user);
        }

        res.status(200).json({ message: 'Project added to user successfully' });
    } catch (error) {
        console.error('Error adding project to user:', error);
        res.status(500).json({ message: 'Error adding project to user', error: error.message });
    }
};
const removeProjectFromUserByEmail = async (req, res) => {
    try {
        const { email, projectId } = req.body;

        console.log(`Removing project with ID: ${projectId} from user with email: ${email}`);
        
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.projectId = user.projectId.filter(id => id !== projectId);
        await userModel.updateUser(user);

        res.status(200).json({ message: 'Project removed from user successfully' });
    } catch (error) {
        console.error('Error removing project from user:', error);
        res.status(500).json({ message: 'Error removing project from user', error: error.message });
    }
};
const updateTaskAssignment = async (req, res) => {
    try {
        const { taskId, newUserEmail, currentUserEmail } = req.body;

        const currentUser = await userModel.findUserByEmail(currentUserEmail);
        if (!currentUser) {
            return handleErrorResponse(res, 404, 'Current user not found');
        }

        currentUser.taskId = currentUser.taskId.filter(id => id !== taskId);
        await userModel.updateUser(currentUser);

        const newUser = await userModel.findUserByEmail(newUserEmail);
        if (!newUser) {
            return handleErrorResponse(res, 404, 'New user not found');
        }

        if (!newUser.taskId.includes(taskId)) {
            newUser.taskId.push(taskId);
            await userModel.updateUser(newUser);
        }

        res.status(200).json({ message: 'Task reassigned successfully' });
    } catch (error) {
        console.error('Error reassigning task:', error);
        handleErrorResponse(res, 500, 'Error reassigning task', error);
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return handleErrorResponse(res, 404, 'User not found');
        }

        res.status(200).json({ id: user.id });
    } catch (error) {
        handleErrorResponse(res, 500, 'Error fetching user by email', error);
    }
};




module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    googleLogin,
    addProjectToUserByEmail,
    removeProjectFromUserByEmail,
    updateTaskAssignment,
    getUserByEmail
};
