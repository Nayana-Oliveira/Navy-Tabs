# Navy

Navy é uma biblioteca pessoal de tablaturas desenvolvida para organizar músicas, informações de execução e arquivos PDF em um único lugar.

O projeto possui uma interface simples e compacta para cadastrar, buscar, filtrar, editar e organizar tablaturas.

## Funcionalidades

- Login privado por e-mail autorizado
- Sessão autenticada por token
- Logout
- Tratamento automático de sessão expirada
- Cadastro de tablaturas
- Edição de tablaturas
- Exclusão com confirmação
- Visualização dos detalhes da música
- Busca por música, artista e outras informações
- Filtros por status
- Filtros por gênero
- Filtros por afinação
- Filtros por dificuldade
- Ordenação da biblioteca
- Controle de status:
  - Quero aprender
  - Aprendendo
  - Aprendida
- Registro de BPM original
- Notas pessoais
- Suporte a link de PDF
- Dashboard com resumo da biblioteca
- Notificações com toast

## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React
- React Hot Toast

### Backend

- Google Apps Script

### Banco de dados

- Google Sheets

### Deploy

- Vercel

## Estrutura

```text
src/
├── components/
│   ├── AddSongModal/
│   ├── DeleteSongModal/
│   ├── EditSongModal/
│   ├── Sidebar/
│   ├── SongCard/
│   ├── SongDetailsModal/
│   └── StatCard/
├── pages/
│   ├── Library/
│   └── Login/
├── services/
│   └── NavyApi.js
├── App.jsx
├── App.css
└── main.jsx
```

## Dados das tablaturas

Cada tablatura pode armazenar:

| Campo | Descrição |
| --- | --- |
| `title` | Nome da música |
| `artist` | Artista |
| `genre` | Gênero |
| `tuning` | Afinação |
| `difficulty` | Dificuldade |
| `status` | Status de aprendizado |
| `bpmOriginal` | BPM original |
| `pdfUrl` | Link do PDF |
| `notes` | Notas pessoais |

## Status

O Navy utiliza três estados para organizar a biblioteca:

| Status | Descrição |
| --- | --- |
| `todo` | Quero aprender |
| `learning` | Aprendendo |
| `learned` | Aprendida |

## Autenticação

O acesso ao Navy é privado.

Os usuários autorizados são definidos em uma aba `Users` no Google Sheets.

```text
email | active
```

Durante o login, o backend verifica se:

1. O e-mail existe na lista de usuários.
2. O usuário está ativo.
3. Uma sessão válida pode ser criada.

Após a autenticação, o backend gera um token de sessão utilizado nas operações protegidas.

Se a sessão expirar ou for invalidada, o frontend remove automaticamente a sessão local e retorna o usuário para a tela de login.

## Banco de dados

As tablaturas são armazenadas em uma aba `Songs` no Google Sheets.

Estrutura:

```text
id
title
artist
genre
tuning
difficulty
status
bpmOriginal
pdfUrl
notes
createdAt
updatedAt
```

O Google Apps Script funciona como uma API entre o frontend e a planilha.

## Executando localmente

Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd Navy
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá o endereço local da aplicação no terminal.

## Build

Para gerar o build de produção:

```bash
npm run build
```

Para testar o build localmente:

```bash
npm run preview
```

## API

A comunicação com o Google Apps Script está centralizada em:

```text
src/services/NavyApi.js
```

As principais operações disponíveis são:

```text
login
logout
listSongs
createSong
updateSong
deleteSong
```

As operações da biblioteca exigem um token de sessão válido.

## Segurança

O Navy foi desenvolvido como uma aplicação pessoal e privada.

O sistema atual utiliza:

- Lista de e-mails autorizados
- Controle de usuário ativo/inativo
- Tokens de sessão temporários
- Validação das operações no backend
- Expiração e invalidação automática da sessão no frontend

O sistema de autenticação foi projetado para o uso pessoal deste projeto e não deve ser tratado como uma solução completa de autenticação para aplicações públicas ou multiusuário.

## PDFs

Atualmente, cada tablatura possui suporte ao campo `pdfUrl`.

O upload e armazenamento dos PDFs será integrado separadamente utilizando Vercel Blob.

## Objetivo

O Navy não é uma plataforma de prática musical ou acompanhamento de progresso.

O objetivo é simples:

> Manter uma biblioteca pessoal, organizada e fácil de consultar para tablaturas em PDF.

## Licença

Projeto de uso pessoal.