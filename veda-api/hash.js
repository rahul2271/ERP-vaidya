const bcrypt = require('bcrypt');
async function getHash() {
    const hash = await bcrypt.hash('YOUR_PASSWORD_HERE', 10);
    console.log(hash);
}
getHash();