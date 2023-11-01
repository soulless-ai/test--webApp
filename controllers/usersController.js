const UserService = require('../services/userService.js');

async function updateBalance(req, res) {
    const { userId, amount } = req.body;

    try {
        const message = await UserService.updateBalance(userId, amount);
        console.log(message);
        res.json({ message: message });
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}

module.exports = { updateBalance };