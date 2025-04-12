
# Condominium Users Challenge

Este projeto é uma aplicação para gerenciar boletos e lotes em um condomínio. Ele permite importar boletos a partir de arquivos CSV, processar PDFs para extração de informações, e gerar relatórios em PDF. 

---

## Arquitetura

A aplicação segue uma arquitetura, com as seguintes camadas principais:

- **Controllers**: Responsáveis por lidar com as requisições HTTP e delegar a lógica para os serviços.
- **Services**: Contêm a lógica de negócios da aplicação.
- **Repositories**: Lidam com a interação direta com o banco de dados.
- **Models**: Representam as entidades do banco de dados utilizando o Sequelize.
- **Utils**: Funções auxiliares como parsing de CSV e geração de PDFs.

---

Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Sequelize + PostgreSQL**
- **TypeScript**

---

## Endpoints

### 1. **Importar Boletos via CSV**
- **URL**: `POST /boletos/import-csv`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: Arquivo CSV no campo `file`
```bash
curl -X POST -F "file=@path/to/file.csv" http://localhost:3000/boletos/import-csv
```

---

### 2. **Processar PDF**
- **URL**: `POST /boletos/process-pdf`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: Arquivo PDF no campo `file`
```bash
curl -X POST -F "file=@path/to/file.pdf" http://localhost:3000/boletos/process-pdf
```

---

### 3. **Listar Boletos**
- **URL**: `GET /boletos`
- **Query Params**:
  - `nome`
  - `valor_inicial`
  - `valor_final`
  - `id_lote`
  - `relatorio=1` → retorna relatório em PDF (Base64)
```bash
curl -X GET "http://localhost:3000/boletos?nome=JOSE&relatorio=1"
```

---

### 4. **Gerar Relatório em PDF**
- **URL**: `GET /boletos?relatorio=1`
- **Descrição**: Retorna todos os boletos como relatório PDF em Base64.
```bash
curl -X GET "http://localhost:3000/boletos?relatorio=1"
```

---

## PDF de Exemplo

Um arquivo de teste está disponível em:

```bash
src/assets/boletos_fake.pdf
```

Este arquivo simula boletos com nomes fictícios, e pode ser usado para testar a extração de nomes e a separação de páginas.

---

## Configuração do Ambiente

1. Crie o `.env` baseado no `.env.example`:
```env
DB_NAME=condominial
DB_USER=meudev
DB_PASSWORD=senha123
DB_HOST=127.0.0.1
PORT=3000
```

2. Instale as dependências:
```bash
npm install
```

3. Execute as migrações:
```bash
npx sequelize-cli db:migrate
```

4. Popule com dados de exemplo:
```bash
npx sequelize-cli db:seed:all
```

5. Inicie o servidor:
```bash
npm run dev
```

---

## Estrutura do Projeto

```
src/
├── config/         # Configuração do banco e Sequelize
├── controllers/    # Lida com as rotas
├── interfaces/     # Tipagens TypeScript
├── repositories/   # Consultas SQL encapsuladas
├── routes/         # Arquivos de rota da API
├── seeds/          # Populadores do banco
├── services/       # Regras de negócio
├── utils/          # CSV parser, PDF handler etc.
```

---

Aqui está a atualização sugerida para o README.md com as instruções sobre como importar os endpoints no Insomnia e exportar o relatório em Base64 para PDF:

```markdown
---

## Importação de Endpoints no Insomnia

Os endpoints da aplicação podem ser facilmente importados no [Insomnia](https://insomnia.rest/) para facilitar os testes. Para isso:

1. Abra o Insomnia.
2. Clique em **Application** (ou no menu principal) e selecione **Import/Export**.
3. Escolha a opção **Import Data** e clique em **From File**.
4. Selecione o arquivo `Insomnia_2025-04-12.yaml` localizado no diretório do projeto:
   ```bash
   /Users/alezzo/Documents/dev-projects/condominium-users-challenge/Insomnia_2025-04-12.yaml
   ```
5. Após a importação, os endpoints estarão disponíveis para uso no Insomnia.

---

## Exportar Relatório em Base64 para PDF

Caso o relatório seja retornado em formato Base64, você pode convertê-lo para um arquivo PDF utilizando o seguinte comando no terminal:

1. Copie o conteúdo Base64 retornado pela API.
2. Execute o comando abaixo, substituindo `JVBERi0xLjcKJYGBg....` pelo conteúdo Base64:
   ```bash
   echo "JVBERi0xLjcKJYGBg...." | base64 --decode > boletos.pdf
   ```
3. O arquivo `boletos.pdf` será gerado no diretório atual.

Agora você pode abrir o arquivo PDF com qualquer leitor de PDF para visualizar o relatório.

---
