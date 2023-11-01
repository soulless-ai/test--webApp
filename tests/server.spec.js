const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000/api/update-balance';
const TOTAL_REQUESTS = 10000;

async function testWithdrawalRequests() {
    const requests = [];

    const startTime = performance.now();

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        const request = axios.post(BASE_URL, { userId: 1, amount: 2 })
        .then((response) => {
            assert.strictEqual(response.status, 200);
        })
        .catch((error) => {
            assert.strictEqual(error.response.status, 400);
        });

        requests.push(request);
    }
    await Promise.all(requests);
    const endTime = performance.now();
    const executionTimeInSeconds = (endTime - startTime) / 1000;
    
    console.log('Тест завершен');
    console.log(`Время выполнения теста: ${executionTimeInSeconds} миллисекунд`);
}

testWithdrawalRequests();