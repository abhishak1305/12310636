require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function authenticate() {
    // Read the client details from output.json
    let registrationData;
    try {
        const outputContent = fs.readFileSync(path.join(__dirname, 'output.json'), 'utf8');
        registrationData = JSON.parse(outputContent);
    } catch (error) {
        console.error('Error: Could not read output.json. Please run registration first.');
        process.exit(1);
    }

    const {
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret
    } = registrationData;

    const payload = {
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret
    };

    console.log('Authenticating to get Authorization Token...');

    try {
        const response = await axios.post('http://4.224.186.213/evaluation-service/auth', payload);

        // Save auth response
        fs.writeFileSync(
            path.join(__dirname, 'auth_response.json'),
            JSON.stringify(response.data, null, 2)
        );

        console.log('\nAuthentication successful');
        console.log(`Token Type: ${response.data.token_type}`);
        console.log(`Access Token: ${response.data.access_token}`);
        console.log('\nFull response saved to auth_response.json');

    } catch (error) {
        console.error('\nAuthentication failed');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

authenticate();
