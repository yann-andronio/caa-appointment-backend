import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { seedAdmin } from './seedAdmin.js';

await connectDB();
await seedAdmin();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
