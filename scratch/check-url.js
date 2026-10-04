const https = require('https');
https.get('https://ceylon-elite-tours-ayyashs-projects-05b52b96.vercel.app', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', err => {
  console.error('Error:', err.message);
});
