const TaskModel = require('../Model/taskModel');
const ProjectModel = require('../Model/projectModel');
const UserModel = require('../Model/userModel');
const taskModel = new TaskModel();
const projectModel = new ProjectModel();
const userModel = new UserModel();

const createTask = async (req, res) => {
    try {
        const { projectId, name, description, startDate, endDate, taskPersonId } = req.body;

        if (!projectId || !name || !taskPersonId) {
            return res.status(400).json({ message: 'Project ID, Task Name, and Task Person ID are required.' });
        }

        const newTask = await taskModel.createTask({
            projectId,
            name,
            description,
            startDate,
            endDate,
            taskPersonId
        });

        console.log("Task created successfully:", newTask.id);

        await projectModel.addTaskToProject(projectId, newTask.id);
        console.log("Task added to project successfully.");

        try {
            await userModel.addTaskToUserByEmail(taskPersonId, newTask.id);
            console.log("Task added to user successfully.");
        } catch (error) {
            console.error("Failed to add task to user:", error);
            return res.status(500).json({ message: 'Failed to add task to user', error: error.message });
        }

        res.status(201).json({ message: 'Task created and added to project and user successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task and updating project/user:', error);
        res.status(500).json({ message: 'Error creating task and updating project/user', error: error.message });
    }
};


const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await taskModel.findTaskById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};

const getTasksByProjectId = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log("Received projectId:", projectId);

        const tasks = await taskModel.getTasksByProjectId(projectId);
        console.log("Retrieved tasks:", tasks);

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by project ID:', error);
        res.status(500).json({ message: 'Error fetching tasks by project ID', error: error.message });
    }
};




const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { name, description, startDate, endDate, taskPersonId } = req.body;

        const updatedTask = {
            id: taskId,
            name,
            description,
            startDate,
            endDate,
            taskPersonId
        };

        await taskModel.updateTask(updatedTask);
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        await taskModel.deleteTask(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};
const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const taskIds = await userModel.getTasksByUserId(userId);

        if (!taskIds || taskIds.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        const tasks = await Promise.all(
            taskIds.map(async (taskId) => {
                const task = await taskModel.findTaskById(taskId); 
                return task ? { id: taskId, name: task.name } : null; 
            })
        );

        const filteredTasks = tasks.filter(task => task !== null);

        res.status(200).json(filteredTasks);
    } catch (error) {
        console.error('Error fetching tasks by user:', error);
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};




module.exports = {
    createTask,
    getTaskById,
    getTasksByProjectId,
    updateTask,
    deleteTask,
    getTasksByUser
};
