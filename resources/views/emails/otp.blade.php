<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(90deg, #2563EA 0%, #1E3A8A 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .otp-box {
            background: #f0f0f0;
            border: 2px dashed #2563EA;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #2563EA;
            font-family: monospace;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .info {
            background: #f9f9f9;
            padding: 10px;
            border-left: 4px solid #2563EA;
            margin: 15px 0;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>STEP Platform</h1>
            <p>Email Verification</p>
        </div>
        <div class="content">
            <p>Hi {{ $firstName }},</p>
            
            <p>Thank you for registering with STEP Platform. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
            </div>
            
            <div class="info">
                <strong>⏱️ This code will expire in 10 minutes.</strong>
            </div>
            
            <p>If you didn't request this code, please ignore this email.</p>
            
            <p>
                Best regards,<br>
                <strong>STEP Platform Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2026 STEP Platform. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
