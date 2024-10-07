const UserModel = require('../Model/userModel');
const userModel = new UserModel();

const handleErrorResponse = (res, status, message, error) => {
    res.status(status).send({ message, error: error?.message });
};

const createUser = async (req, res) => {
    try {
        const { id, name, email, password, age, taskId, projectId, messageId } = req.body;
        

        // יצירת משתמש חדש ושמירתו ב-Firestore
        const newUser = await userModel.createUser({
            id,
            name,
            email,
            password,
            age,
            taskId,
            projectId,
            messageId
        });

        // // החזרת המידע של המשתמש שנשמר בתגובה, כולל ID
        // const savedUser = {
        //     id: id, // כאן אנו מוסיפים את ה-ID
        //     name,
        //     email,
        //     age,
        //     taskId,
        //     projectId,
        //     messageId
        // };

        res.status(201).send({ message: 'User created successfully', user: newUser });
        console.log('User created successfully', newUser);
    } catch (error) {
        handleErrorResponse(res, 400, 'Error creating user', error);
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
    deleteUser
};
