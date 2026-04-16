import 'dotenv/config';
import app from './app.js';
import { PORT } from './config.js';


app.listen(PORT, () => {
  console.log(`Gender Classifier API listening on port: https://localhost:${PORT}`);
  console.log(`📍 Local: https://localhost:${PORT}`);
  console.log(`🔍 Health check: https://localhost:${PORT}/health`);
  console.log(`🎯 API endpoint: https://localhost:${PORT}/api/classify?name={name}`);
});
