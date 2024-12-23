
# ProjectSync

## Overview
ProjectSync is a comprehensive project management tool designed to facilitate seamless team collaboration and task management. It leverages modern web and mobile technologies to provide a real-time, user-friendly platform for managing all aspects of a project.

### Key Features
- **User Authentication:** Secure sign-in and user management via Firebase.
- **Task Management:** Assign, track, and update tasks within projects.
- **Real-Time Updates:** Immediate synchronization across all devices.
- **Interactive Dashboards:** Intuitive interfaces for project and task tracking.

## Technology Stack
- **Frontend:** React Native (Mobile), structured with navigation and screens.
- **Backend:** Node.js with Express framework, structured with controllers, models, routes, and middleware.
- **Database:** Firebase, utilized for real-time data handling and storage.
- **Hosting:** Render for deploying the backend services.
- **Continuous Integration/Continuous Deployment (CI/CD):** CircleCI, used to automate builds, tests, and deployments, ensuring high-quality code and rapid iteration cycles.


## Project Structure
- **Backend:** Contains the API logic, Firebase integration, and middleware.
- **Frontend:** Includes React Native components, navigation, and screens for the mobile app.

## Getting Started

### Prerequisites
- Node.js (latest stable version)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/hazanido/APP_Project_management.git
   cd APP_Project_management
   ```

2. Navigate to the Backend directory and install dependencies:
   ```bash
   cd Backend
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

4. In a new terminal, navigate to the Frontend directory and install dependencies:
   ```bash
   cd ../Frontend
   npm install
   ```

5. Start the React Native application:
   ```bash
   npm start
   ```

### Accessing the Application
- The backend is accessible at [ProjectSync Backend](https://app-project-management.onrender.com). The server is also hosted at this address for production use.

- For mobile access, use the React Native application initialized in the Frontend directory.

