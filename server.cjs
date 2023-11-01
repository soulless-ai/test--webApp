const express = require('express');
const app = express();
const path = require('path');
const usersRoutes = require('./routes/usersRoutes.js');
const UserService = require('./services/userService.js');

const { pool } = require('./config/db.js');
const customMiddleware = require('./middleware/customMiddleware.js');

customMiddleware(app);

UserService.createUsersTable();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

process.on('SIGINT', async () => {
    console.log("Получен сигнал SIGINT (Ctrl+C). Выполняем завершающие операции...");
    try {
        const dropTableQuery = 'DROP TABLE IF EXISTS users;';
        await pool.query(dropTableQuery);
        console.log('Таблица "users" удалена.');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при удалении таблицы:', error);
        process.exit(1);
    }
});

app.use('/api', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});