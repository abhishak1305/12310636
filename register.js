require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function register() {
    const {
        EMAIL,
        NAME,
        MOBILE,
        ROLL_NO,
        GITHUB_USERNAME,
        ACCESS_CODE
    } = process.env;

    // 1. Validate missing fields
    const missingFields = [];
    if (!EMAIL) missingFields.push('EMAIL');
    if (!NAME) missingFields.push('NAME');
    if (!MOBILE) missingFields.push('MOBILE');
    if (!ROLL_NO) missingFields.push('ROLL_NO');
    if (!GITHUB_USERNAME) missingFields.push('GITHUB_USERNAME');
    if (!ACCESS_CODE) missingFields.push('ACCESS_CODE');

    if (missingFields.length > 0) {
        console.error('Error: Missing required environment variables:');
        missingFields.forEach(field => console.error(`- ${field}`));
        console.error('\nPlease fill in the .env file before running this script.');
        process.exit(1);
    }

    // 2. Extract full repo path (e.g., username/repo) if a URL is provided
    let cleanedGithubUsername = GITHUB_USERNAME.trim();
    if (cleanedGithubUsername.includes('github.com/')) {
        // Strip everything up to github.com/
        cleanedGithubUsername = cleanedGithubUsername.split('github.com/').pop();
        // Remove .git suffix and trailing slash
        cleanedGithubUsername = cleanedGithubUsername.replace(/\.git$/, '').replace(/\/$/, '');
    }

    const payload = {
        email: EMAIL,
        name: NAME,
        mobileNo: MOBILE,
        githubUsername: cleanedGithubUsername,
        rollNo: ROLL_NO,
        accessCode: ACCESS_CODE
    };

    console.log('Registering user with payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post('http://4.224.186.213/evaluation-service/register', payload);

        // 3. Save full response to output.json
        fs.writeFileSync(
            path.join(__dirname, 'output.json'),
            JSON.stringify(response.data, null, 2)
        );

        // 4. Display success information
        console.log('\nRegistration successful');
        console.log(`Client ID: ${response.data.clientID || 'N/A'}`);
        console.log(`Client Secret: ${response.data.clientSecret || 'N/A'}`);
        console.log('\nFull response saved to output.json');

    } catch (error) {
        console.error('\nRegistration failed');

        if (error.response) {
            // Server responded with a status code outside the range of 2xx
            const status = error.response.status;
            const data = error.response.data;

            // Save error response to output.json for debugging
            fs.writeFileSync(
                path.join(__dirname, 'output.json'),
                JSON.stringify(data, null, 2)
            );

            if (status === 409 || (data.message && data.message.toLowerCase().includes('duplicate'))) {
                console.error('Error: Duplicate registration. This user is already registered.');
            } else if (status === 401 || (data.message && data.message.toLowerCase().includes('access code'))) {
                console.error('Error: Invalid access code.');
            } else {
                console.error(`Status: ${status}`);
                console.error('Response:', JSON.stringify(data, null, 2));
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error: Network error. Could not reach the evaluation server.');
            console.error('Details:', error.message);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
        
        process.exit(1);
    }
}

register();
