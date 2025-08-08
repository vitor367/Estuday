// Script para testar o roteamento localmente
const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos
app.use(express.static('dist'));

// SPA fallback - todas as rotas retornam index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor local rodando em http://localhost:${PORT}`);
  console.log('✅ Teste o roteamento navegando entre as telas');
});
