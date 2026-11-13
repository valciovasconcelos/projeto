## Requisitos

- Node.js 22 ou superior - Conferir a versão: node -v
- MySQL 8 ou superior - Conferir a versão: mysql --version

## Como rodar o projeto baixado

Duplicar o arquivo `.env.example` e renomear a cópia para `.env`.<br>
Alterar no arquivo .env as credenciais do banco de dados<br>

Instalar todas as dependencias indicada pelo package.json.

```
npm install
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.

```
npm run start:watch
```

Executar as migrations para criar as tabelas no banco de dados.

```
npx typeorm migration:run -d dist/data-source.js
```

Executar as seeds para cadastrar registro de teste nas tabelas no banco de dados.

```
node dist/run-seeds.js
```

## Testes da API

Com o servidor em execução e as migrations aplicadas, execute a coleção completa do Postman com:

```
npm test
```

O teste cria registros identificados para a execução, percorre as operações de consulta, cadastro, atualização e exclusão das cinco entidades do diagrama, verifica as relações entre elas e testa validações de usuário. Ao final, remove os registros criados. A coleção também pode ser importada manualmente no Postman pelo arquivo `postman_collection.json`.

## Testes no Postman

Importar o arquivo `postman_collection.json` no Postman. Com o servidor iniciado na porta configurada (por padrão, 8080) e as migrations executadas, a coleção contém requisições CRUD para situações, categorias, situações de produto e produtos. Cada requisição valida o status HTTP esperado e se a resposta é JSON válido.

As operações de consulta, atualização e remoção usam o ID `1` como exemplo. Para testá-las, confirme que esse registro existe ou ajuste o ID para um registro retornado pela requisição de listagem. Para criar produtos, crie antes uma categoria e uma situação de produto e use os respectivos IDs no corpo da requisição.

## Sequencia para criar projeto

Criar o arquivo package

```
npm init
```

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidade.

```
npm i express
```

Instalar os pacotes para suporte ao TypeScript

```
npm i --save-dev @types/express
```

```
npm i --save-dev @types/node@22.15.2
```

Instalar o compilador do projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado

```
npm i --save-dev ts-node
```

Gerar o arquivo de configuração para o TypeScript.

```
npx tsc --init
```

Compilar o arquivo TypeScript

```
npx tsc
```

Executar o arquivo gerado com o Node.js

```
node dist/index.js
```

Instalar a dependência para rodar processos simultâneo.

```
npm i --save-dev concurrently
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.

```
npm run start:watch
```

Criar banse de dados no myqsl

```
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Instalar a dependência para conectar o Node.js (TS) com BD.

```
npm i typeorm --save
```

Biblioteca utilizada no TypeScript para adicionar metadados (informações adicionais) a classes.

```
npm i reflect-metadata --save
```

Instalar o drive do banco de dados MySQL.

```
npm i mysql2 --save
```

Manipular variáveis de ambiente.

```
npm i dotenv --save
```

Instalar os tipos de variáveis para o TypeScript

```
npm i --save-dev @types/dotenv
```

Criar a MIGRATION que será usada para criar a tabela no banco de dados

```
npx typeorm migration:create src/migration/CreateSituationsTable
```

```
npx typeorm migration:create src/migration/CreateUsersTable
```

```
npx typeorm migration:create src/migration/AddSlugToProducts
```

```
npx typeorm migration:create src/migration/AddPasswordToUsers
```

```
npx typeorm migration:create src/migration/AddRecoverPasswordToUsers
```

Executar as migrations para criar as tabelas no banco de dados.

```
npx typeorm migration:run -d dist/data-source.js
```

Validar formulário.

```
npm i yup
```

Permitir requisição externa.

```
npm i cors
```

```
npm install --save-dev @types/cors
```

Converter o slug automaticamente antes de salvar no banco de dados.

```
npm install slugify
```

Instalar o módulo para criptografar a senha.

```
npm install --save bcryptjs

```

Instalar os tipos do bcryptjs.

```
npm install --save-dev @types/bcryptjs
```

Instalar a dependencia JWT para manipular token de autenticação.

```
npm install jsonwebtoken
```

Instalar os tipos do jsonwebtoken.

```
npm i --save-dev @types/jsonwebtoken
```

Instalar o módulo para enviar e-mail.

```
npm install nodemailer
```

Instalar os tipos do nodemailer.

```
npm install --save-dev @types/nodemailer
```

....
realizando testes
.....
realizando testes de finalidade
