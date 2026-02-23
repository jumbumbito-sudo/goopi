import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descargar Goopi App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 24px;
      padding: 40px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .logo {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      color: #10B981;
      font-size: 28px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 30px;
    }
    .download-btn {
      display: inline-block;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: white;
      padding: 16px 40px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
    .file-info {
      margin-top: 20px;
      padding: 15px;
      background: #f3f4f6;
      border-radius: 12px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🚕</div>
    <h1>Goopi App</h1>
    <p>Tu app de taxi, delivery y guía comercial</p>
    <a href="/api/download" class="download-btn">
      📦 Descargar ZIP
    </a>
    <div class="file-info">
      <strong>goopi-final.zip</strong><br>
      98 KB - Listo para GitHub/Vercel
    </div>
  </div>
</body>
</html>
  `;
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
