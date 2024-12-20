const ProjectModel = require('../Model/projectModel');
const UserModel = require('../Model/userModel'); 
const projectModel = new ProjectModel();
const userModel = new UserModel();


const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, managerId, members, tasks } = req.body;

        if (!name || !managerId) {
            return res.status(400).json({ message: 'Project name and managerId are required.' });
        }

        const newProject = await projectModel.createProject({
            name,
            description,
            startDate,
            endDate,
            managerId,
            members,
            tasks
        });

        await userModel.addProjectToUser(managerId, newProject.id);

        if (members) {
            const memberEmails = typeof members === 'string' ? members.split(',').map(email => email.trim()) : members;

            for (const email of memberEmails) {
                try {
                    await userModel.addProjectToUserByEmail(email, newProject.id);
                } catch (error) {
                    console.error(`User with email ${email} not found. Skipping this user.`);
                }
            }
        }

        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};




const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params; 
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const project = await projectModel.findProjectById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};




const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        const { name, description, startDate, endDate, managerId, members, tasks } = req.body;
        const updatedProject = { name, description, startDate, endDate, managerId, members, tasks };

        await projectModel.updateProject({ id: projectId, ...updatedProject });
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};




const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }

        await projectModel.deleteProject(projectId);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};




const getProjectsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const managedProjects = await projectModel.getProjectsByUser(userId);

        const memberProjects = await projectModel.getProjectsByUserMember(user.email);

        const allProjects = [...managedProjects, ...memberProjects];

        if (allProjects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.status(200).json(allProjects);
    } catch (error) {
        console.error('Error fetching projects for user:', error);
        res.status(500).json({ message: 'Error fetching projects for user', error: error.message });
    }
};

const addParticipantByEmail = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;
        
        console.log('Adding participant to project:', projectId, 'with email:', email);

        const project = await projectModel.findProjectById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.id = projectId;

        if (!project.members.includes(email)) {
            project.members.push(email);
            await projectModel.updateProject(project); 
        }

        res.status(200).json({ message: 'Participant added to project successfully' });
    } catch (error) {
        console.error('Error adding participant to project:', error);
        res.status(500).json({ message: 'Error adding participant to project', error: error.message });
    }
};

const removeParticipantFromProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        console.log(`Removing participant with email: ${email} from project: ${projectId}`);
        
        const project = await projectModel.findProjectById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        project.members = project.members.filter(member => member !== email);
        await projectModel.updateProject(project);

        res.status(200).json({ message: 'Participant removed from project successfully' });
    } catch (error) {
        console.error('Error removing participant from project:', error);
        res.status(500).json({ message: 'Error removing participant from project', error: error.message });
    }
};
const getProjectParticipants = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const participants = await projectModel.getParticipantsByProjectId(projectId);

        if (!participants) {
            return res.status(404).json({ message: 'משתתפים לא נמצאו' });
        }

        res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'שגיאה בטעינת המשתתפים', error: error.message });
    }
};




module.exports = {
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectsByUser,
    addParticipantByEmail,
    removeParticipantFromProject,
    getProjectParticipants
};
