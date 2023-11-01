const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database',
    password: 'standart',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    },
    max: 40
});

pool.on('error', (err) => {
        console.error('Database error:', err.message);
    });
pool.connect()
    .then(client => {
        console.log('Успешное подключение к базе данных');
        client.release();
    })
    .catch(error => {
        console.error('Ошибка при подключении к базе данных:', error);
    });

module.exports = { pool };