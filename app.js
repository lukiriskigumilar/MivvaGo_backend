import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
dotenv.config();

import userAuthRoutes from './src/routes/auth/user/user_auth.js';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(helmet());
// app.use(cors());

app.use('/api/v1/auth/user', userAuthRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



