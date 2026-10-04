const https = require('https');

https.get('https://ceylon-elite-tours.vercel.app/', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Body:', data.substring(0, 500)));
}).on('error', err => {
  console.error('Error:', err.message);
});
