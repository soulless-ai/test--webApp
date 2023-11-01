const fs = require('fs');

class User {
    static async tableExists(client) {
        try {
            const checkTableQuery = 'SELECT 1 FROM information_schema.tables WHERE table_name = $1';
            const result = await client.query(checkTableQuery, ['users']);
            return result.rows.length === 0;
        } catch (error) {
            throw new Error('Ошибка при проверке существования таблицы: ' + error.message);
        }
    }

    static async createTable(client) {
        try {
            const createTableQuery = fs.readFileSync('./migration/create_users_table.sql', 'utf8');
            await client.query(createTableQuery);
        } catch (error) {
            throw new Error('Ошибка при создании таблицы: ' + error.message);
        }
    }

    static async createInitialUser(client) {
        try {
            const createUserQuery = fs.readFileSync('./migration/create_initial_user.sql', 'utf8');
            await client.query(createUserQuery);
        } catch (error) {
            throw new Error('Ошибка при создании начального пользователя: ' + error.message);
        }
    }

    static async findById(userId, client) {
        try {
            const user = await client.query('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
            return user;
        } catch (error) {
            throw new Error('Ошибка при поиске пользователя: ' + error.message);
        }
    }

    static async updateBalance(userId, amount, client) {
        try {
            await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
            return true;
        } catch (error) {
            throw new Error('Ошибка при обновлении баланса: ' + error.message);
        }
    }
}

module.exports = User;
