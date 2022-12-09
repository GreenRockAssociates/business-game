const dotenv = require('dotenv')
module.exports = async function () {
    dotenv.config({path: '.env'});
}