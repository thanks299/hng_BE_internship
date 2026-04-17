import 'dotenv/config';
import app from './app.js';
import { PORT } from './config.js';


app.listen(PORT, () => {
  console.log(`Gender Classifier API listening on port: http://localhost:${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 API endpoint: http://localhost:${PORT}/api/classify?name={name}`);
});
