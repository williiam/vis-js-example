   // src/api/index.ts
   import axios from 'axios';
   import qs from 'qs';

   export const splunkApi = axios.create({
     baseURL: '/api', // Use the proxy path
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
     },
   });