// Load environment variables before running tests
const dotenv = require('dotenv')
module.exports = async function () {
    dotenv.config({path: '.env'});
    process.env.NODE_ENV = "test"; // Override NODE_ENV since this runs only when tests occur
}