const User = require('../models/userModel.js');
const { pool } = require('../config/db.js');
const { Mutex } = require('async-mutex');
const mutex = new Mutex();

class UserService {
    static async createUsersTable() {
        let client;
        const release = await mutex.acquire();
        try {
            client = await pool.connect();
            await client.query('BEGIN');
            
            const userTableExists = await User.tableExists(client);
    
            if (userTableExists) {
                await User.createTable(client);
                await User.createInitialUser(client);
                await client.query('COMMIT');
                console.log('Таблица "users" создана.');
                console.log('Пользователь успешно создан с балансом 10000.');
            } else {
                await client.query('ROLLBACK');
                console.log('Таблица "users" уже существует.');
            }
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            console.error('Ошибка при проверке или создании таблицы:', error);
        } finally {
            if (client) {
                client.release();
            }
            release();
        }
    }
    static async updateBalance(userId, amount) {
        const release = await mutex.acquire();
        if (typeof userId !== 'number' || typeof amount !== 'number') {
            throw new Error('Некорректные параметры.');
        }
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            const user = await User.findById(userId, client);
            if (user.rows.length === 0) {
                await client.query('ROLLBACK');
                return "Пользователь не найден";
            }
            const balance = user.rows[0].balance;
            if (balance >= amount) {
                if (await User.updateBalance(userId, amount, client)) {
                    await client.query('COMMIT');
                    return 'Средства успешно сняты. Баланс: ' + (balance - 2);
                } else {
                    await client.query('ROLLBACK');
                    return 'Ошибка при изменении. Баланс: ' + balance;
                }
            } else {
                await client.query('ROLLBACK');
                return 'Cредств недостаточно. Баланс: ' + balance;
            }
        } catch (error) {
            await client.query('ROLLBACK');
            return "Ошибка сервера: " + error.message;
        } finally {
            client.release();
            release();
        }
    }
}

module.exports = UserService;