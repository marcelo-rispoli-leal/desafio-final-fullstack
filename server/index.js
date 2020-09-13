import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './services/db.js';
import { transactionRouter } from './routes/transactionRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Vinculando o React ao app
 */
app.use(
  express.static(
    path.join(fileURLToPath(import.meta.url), '../../client/build')
  )
);

/**
 * Rota raiz
 */
app.get('/api/', (_, response) => {
  response.send({
    message:
      'Bem-vindo à API de lançamentos. Acesse /transaction e siga as orientações',
  });
});

/**
 * Rotas principais do app
 */
app.use('/api/transaction', transactionRouter);

/**
 * Conexão ao Banco de Dados
 */
console.log('Iniciando conexão ao MongoDB...');
db.mongoose.connect(
  db.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.error(`Erro na conexão ao MongoDB - ${err}`);
    }
  }
);

const { connection } = db.mongoose;

connection.once('open', () => {
  console.log('Conectado ao MongoDB');
  /**
   * Definição de porta e
   * inicialização do app
   */
  const APP_PORT = process.env.PORT || 3001;
  app.listen(APP_PORT, () => {
    console.log(`Servidor iniciado na porta ${APP_PORT}`);
  });
});
