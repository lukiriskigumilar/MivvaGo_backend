import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import useragent from 'express-useragent';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

import userAuthRoutes from './src/routes/auth/user/user_auth.js';
import validateContentTypeOnlyJson from './src/middlewares/validateContentType.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to validate content type
// This middleware checks if the request's Content-Type is application/json for specific HTTP methods
app.use(validateContentTypeOnlyJson);

app.use(express.json());
app.use(helmet());
app.use(useragent.express())
app.use(cookieParser())
// app.use(cors());

app.use('/api/v1/auth/user', userAuthRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



