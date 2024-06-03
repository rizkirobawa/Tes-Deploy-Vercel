const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('Tugas ini dijalankan setiap menit.');
});