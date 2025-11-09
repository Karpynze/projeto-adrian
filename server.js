const express = require('express');
const { Counter, Histogram, collectDefaultMetrics, register } = require('prom-client');

const app = express();

// 🔧 Usa variável de ambiente (ou 3000 como padrão)
const PORT = process.env.PORT || 3000;

// -------------------- Métricas -------------------- //

// Métricas de requisições
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code']
});

// Métrica de latência
const httpRequestDurationMs = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duração das requisições HTTP em ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000] // buckets em ms
});

// Métricas padrão de processo (CPU, memória, etc)
collectDefaultMetrics();

// -------------------- Middleware -------------------- //
app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer(); // inicia timer de latência

  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode
    });
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });

  next();
});

// -------------------- Rotas -------------------- //
app.get('/', (req, res) => {
  res.send('Hello World! 🌍');
});

// Endpoint para Prometheus coletar métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// -------------------- Iniciar servidor -------------------- //
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse métricas em http://localhost:${PORT}/metrics`);
});
