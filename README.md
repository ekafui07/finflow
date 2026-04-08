
## ⚙️ WSL Development Environment Setup

This project uses a WSL2-based development environment to mirror production-like Linux systems, ensuring compatibility with cloud platforms such as AWS and Firebase. This guide outlines the steps to set up the environment from scratch on a new WSL2 (Ubuntu) instance.

### 1. Update System Packages
First, ensure all your system packages are up-to-date.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Core Development Tools
Install the essential tools required for building, version control, and general development.

```bash
sudo apt install -y \
  build-essential \
  curl \
  git \
  unzip \
  zip \
  ca-certificates \
  software-properties-common
```
- **build-essential**: Contains compilers (like `gcc`) and other tools for compiling software.
- **curl**: A command-line tool for transferring data with URLs.
- **git**: The version control system used for this project.
- **zip/unzip**: Utilities for handling compressed files.

### 3. Install Node Version Manager (NVM)
NVM allows you to manage multiple versions of Node.js on a single machine.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
After installation, load NVM into your current shell session.

```bash
source ~/.bashrc
```

### 4. Install and Use Node.js (LTS)
Install the latest Long-Term Support (LTS) version of Node.js, which is recommended for stability.

```bash
nvm install --lts
nvm use --lts
```
Verify that Node.js and npm are installed correctly:
```bash
node -v
npm -v
```
> **Note:** For maximum compatibility with this project and its dependencies, **Node.js v20 (LTS)** is the recommended version.

### 5. Set Up the Project
Navigate to your projects directory and install the necessary dependencies.

```bash
# Replace <your-project-directory> with the actual path
cd /path/to/<your-project-directory>

# Install project dependencies
npm install
```

### 6. Run the Development Server
Start the local development server.

```bash
npm run dev
```

### 7. Access the Application
Once the server is running, you can access the application in your web browser at:

[http://localhost:5173](http://localhost:5173)

### 8. Configure Firebase for Local Development
To enable services like Firebase Authentication while running the app locally, you must add `localhost` to the authorized domains in your Firebase project.

1.  Go to the **Firebase Console**.
2.  Navigate to your project, then go to **Authentication** > **Settings** > **Authorized domains**.
3.  Click **Add domain** and add the following two entries:
    - `localhost`
    - `127.0.0.1`

### 9. Clean Up Unused Packages (Optional)
To keep your system clean, you can remove any packages that were installed as dependencies but are no longer needed.

```bash
sudo apt autoremove
```