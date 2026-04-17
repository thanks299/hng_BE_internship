import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

console.log('🧪 Testing Gender Classifier API\n');

// Test 1: Health check
try {
  const health = await axios.get(`${BASE_URL}/health`);
  console.log('✅ Health check:', health.status);
} catch (error) {
  console.log('❌ Health check failed:', error.response?.status || error.message);
}

// Test 2: Valid name
try {
  const result = await axios.get(`${BASE_URL}/api/classify`, {
    params: { name: 'Alex' }
  });
  console.log('✅ Valid name (Alex):', result.status, result.data.status);
} catch (error) {
  console.log('❌ Valid name failed:', error.response?.status, error.response?.data);
}

// Test 3: Empty name
try {
  await axios.get(`${BASE_URL}/api/classify`, {
    params: { name: '' }
  });
  console.log('✅ Empty name test passed');
} catch (error) {
  if (error.response?.status === 400) {
    console.log('✅ Empty name correctly returned 400');
  } else {
    console.log('❌ Empty name test failed:', error.response?.status);
  }
}

// Test 4: Missing name
try {
  await axios.get(`${BASE_URL}/api/classify`);
  console.log('✅ Missing name test passed');
} catch (error) {
  if (error.response?.status === 400) {
    console.log('✅ Missing name correctly returned 400');
  } else {
    console.log('❌ Missing name test failed:', error.response?.status);
  }
}