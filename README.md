# Dr.Appointment Backend

This repository contains the backend code for the Dr.Appointment project.
The backend has been deployed at: https://dr-appointment-backend-ba1c.onrender.com. Please note that since it's hosted on a free server, it might take some time to respond.
You can check the health status at: https://dr-appointment-backend-ba1c.onrender.com/health.

## Getting Started

Follow the steps below to set up and run the backend locally.

### Prerequisites

Ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   If you encounter peer dependency issues, use:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Add a `.env` file in the root folder with the following content:
   ```env
   PORT=8080
   MODE=development
   MONGO_URL=mongodb+srv://ayush21singla:8khwx4Z3UZmeb2cE@cluster0.rwhpi6a.mongodb.net/AppointMyDoctor
   JSONWEBTOKEN=abcdexyz123456
   ```

### Running the Project

Start the server using:
```bash
npm start
```

### Health Check

You can verify that the server is running by accessing the following endpoint in your browser or using a tool like Postman:

[http://localhost:8080/health](http://localhost:8080/health)

This endpoint responds with:
```plaintext
Server is up and running!
```

### Logs

On successful startup, you will see two logs in the terminal:
1. **Server is running on port 8080**
2. **MongoDB connected successfully**

## API Endpoints

- **Health Check:**
  ```javascript
  app.get('/health', (req, res) => {
      res.status(200).send('Server is up and running!');
  });
  ```

## License

This project is licensed under the MIT License.
