const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your email service (use your real credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ifidonabraham249@gmail.com',
        pass: 'qeex mrqp klvf qdai' // Use App Password, not your real password
    }
});

app.post('/send-reset-code', async (req, res) => {
    const { to, code } = req.body;
    try {
        await transporter.sendMail({
            from: '"Real Estate Finder" <ifidonabraham249@gmail.com>',
            to,
            subject: 'Your Password Reset Code',
            text: `Your password reset code is: ${code}`,
            html: `<p>Your password reset code is: <b>${code}</b></p>`
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(4000, () => {
    console.log('Email server running on http://localhost:4000');
});