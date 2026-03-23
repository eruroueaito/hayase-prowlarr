/**
 * Module: CORS Proxy for Prowlarr
 * Purpose: Forward requests from Hayase extension (Web Worker) to local Prowlarr,
 *          adding CORS headers and injecting API key so the extension needs zero config.
 * Input: HTTPS requests with path = Prowlarr API path (e.g. /api/v1/search?query=...)
 * Output: Prowlarr response with CORS headers added
 * Dependencies: Node.js built-in https/http modules, mkcert-generated certs at ~/localhost*.pem
 * Notes: Set PROWLARR_API_KEY env var or edit the default below
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = process.env.PORT || 3001;
const PROWLARR_URL = process.env.PROWLARR_URL || 'http://localhost:9696';
const API_KEY = process.env.PROWLARR_API_KEY || '7a03897923eb41fdbbdb7e76a275bd23';

const certDir = os.homedir();
const key = fs.readFileSync(path.join(certDir, 'localhost-key.pem'));
const cert = fs.readFileSync(path.join(certDir, 'localhost.pem'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Api-Key, Content-Type, apikey',
  'Access-Control-Max-Age': '86400',
};

const server = https.createServer({ key, cert }, (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const targetUrl = new URL(req.url, PROWLARR_URL);
  const fwdHeaders = { ...req.headers, host: targetUrl.host, 'x-api-key': API_KEY };
  delete fwdHeaders.origin;
  delete fwdHeaders.referer;
  const proxyReq = http.request(targetUrl, {
    method: req.method,
    headers: fwdHeaders,
  }, (proxyRes) => {
    const upstream = { ...proxyRes.headers };
    delete upstream['access-control-allow-origin'];
    delete upstream['access-control-allow-methods'];
    delete upstream['access-control-allow-headers'];
    res.writeHead(proxyRes.statusCode, { ...upstream, ...corsHeaders });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Failed to connect to Prowlarr', detail: err.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`CORS proxy listening on https://localhost:${PORT}`);
  console.log(`Forwarding to Prowlarr at ${PROWLARR_URL}`);
});
