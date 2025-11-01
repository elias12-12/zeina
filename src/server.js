/**
 * Server entry point - starts the Express application
 * Configures port and starts listening for HTTP requests
 */
import {app} from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`API http://localhost:${port}`));