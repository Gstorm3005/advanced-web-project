const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'], // Update with your frontend URLs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'authenticated'] // Add 'authenticated' header
}));

// Authentication middleware
// app.use((req, res, next) => {
//     console.log('Headers:', req.headers);  // Log headers to debug
//     if (req.headers.authenticated === 'true') {  // Compare to 'true' as string
//         next();
//     } else {
//         res.status(403).json({ error: 'User not authenticated' });
//     }
// });

app.use('/enduser', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: { '^/enduser': '' },
}));

app.use('/restaurateur', createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: { '^/restaurateur': '' },
}));

app.use('/delivery', createProxyMiddleware({
    target: 'http://localhost:5003',
    changeOrigin: true,
    pathRewrite: { '^/delivery': '' },
}));

app.use('/developer', createProxyMiddleware({
    target: 'http://localhost:5004',
    changeOrigin: true,
    pathRewrite: { '^/developer': '' },
}));

app.use('/commercial', createProxyMiddleware({
    target: 'http://localhost:5005',
    changeOrigin: true,
    pathRewrite: { '^/commercial': '' },
}));

app.use('/technical', createProxyMiddleware({
    target: 'http://localhost:5006',
    changeOrigin: true,
    pathRewrite: { '^/technical': '' },
}));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
// /enduser/backend/node_modules
// /enduser/frontend/node_modules
// /restaurateur/backend/node_modules
// /restaurateur/frontend/node_modules
// /delivery/backend/node_modules
// /delivery/frontend/node_modules
// /developer/backend/node_modules
// /developer/frontend/node_modules
// /commercial/backend/node_modules
// /commercial/frontend/node_modules
// /technical/backend/node_modules
// /technical/frontend/node_modules
// /gateway/node_modules