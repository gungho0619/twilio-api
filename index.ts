import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { Twilio } from 'twilio';

dotenv.config();

const app = express();
const PORT = 5000;

console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN);

const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send', async (req: Request, res: Response) => {
    const { type, content } = req.body;
    if (type === 'call') {

        try {
            const call = await twilioClient.calls.create({
                to: '+12096295774',
                from: process.env.TWILIO_PHONE_NUMBER,
                twiml: `<Response><Say>${content}</Say></Response>`,
            });

            console.log(`SID: ${call.sid}`);
            res.status(200).send('Test call triggered successfully');
        } catch (error) {
            console.error('Error initiating call:', error);
            res.status(500).send('Error triggering test call');
        }
    } else {
        res.status(200).send('No valid symbol received');
    }
});

// A simple route for testing the server
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, TypeScript with Node.js and Twilio!');
});

app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
