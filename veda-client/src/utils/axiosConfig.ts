// import axios from 'axios';

// const api = axios.create({
//   baseURL: MONGO_URI, // Ensure this is your Backend URL
// });

// // ✅ This interceptor injects your token into EVERY request automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



import axios from 'axios';

const api = axios.create({
  // 🚀 FIX: Now it looks for your live Render URL (or falls back to localhost for local testing)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", 
});

// ✅ This interceptor injects your token into EVERY request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
