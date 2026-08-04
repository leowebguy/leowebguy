import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { RESEND_API_KEY, DEFAULT_FROM_EMAIL } = process.env;

if (!RESEND_API_KEY) {
    console.error("Error: RESEND_API_KEY is not defined in the .env file.");
    process.exit(1);
}

console.log("Directly testing Resend API...");
console.log(`RESEND_API_KEY: ${RESEND_API_KEY.substring(0, 10)}...`);
console.log(`DEFAULT_FROM_EMAIL: ${DEFAULT_FROM_EMAIL}`);

// Let's test with the provided from email
async function testDirectResend(fromEmail) {
    console.log(`\nTesting with from: ${fromEmail}`);
    try {
        const response = await axios.post('https://api.resend.com/emails', {
            from: fromEmail,
            to: 'leowebguy@gmail.com',
            subject: 'Teste Direto Resend - leowebguy.com',
            html: '<p>Este é um e-mail de teste direto para validar a API Key do Resend.</p>'
        }, {
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`SUCCESS [${fromEmail}]:`, response.status, response.data);
    } catch (error) {
        console.error(`FAILURE [${fromEmail}]:`);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// 1. Test with the default from email
await testDirectResend(DEFAULT_FROM_EMAIL || 'noreply@gaunte.com');

// 2. Test with the standard Resend testing sender 'onboarding@resend.dev'
await testDirectResend('onboarding@resend.dev');
