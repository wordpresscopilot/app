<div align="center">
  <img width="1395" alt="Screenshot 2024-12-31 at 4 35 49 PM" src="https://github.com/user-attachments/assets/a9f611a3-15b3-4e88-a24d-8ac993b32ea9" />

  <h1 align="center">WordPress AI Copilot</h1>
  <h3>Open Source AI Agent for Wordpress Site Management and Integrations</h3>
</div>

<div align="center">
  <a href="https://github.com/wordpresscopilot/app/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue"></a>
</div>

<p align="center">
    <a href="#-introduction">Introduction</a> ·
    <a href="#-features">Features</a> ·
    <a href="#-tech-stack">Tech Stack</a> ·
    <a href="#-companion-plugin">Companion Plugin</a> ·
    <a href="#-getting-started">Getting Started</a>
</p>

## ✨ Introduction

WordPress AI Copilot is an open source project that brings the power of AI to WordPress site management. It provides an intuitive interface for interacting with WordPress sites through natural language, automating common tasks, and leveraging AI for content generation and site optimization.

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI-Powered Site Management | Natural language interface for WordPress administration |
| 🔄 Multi-Site Support | Manage multiple WordPress sites |
| 🔍 Smart Content Analysis | AI-powered content suggestions and optimization |
| 🛠 Automated Tasks | Streamline common WordPress management tasks using natural language |

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) – Web Framework
- [shadcn/ui](https://ui.shadcn.com) - React UI Components
- [AssistantUI](https://assistantui.com) - React UI Components for AI Agent Chat
- [Clerk](https://clerk.dev) - Authentication
- [Anthropic](https://anthropic.com) - AI LLM Provider
- [Prisma](https://prisma.io) - ORM
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Deployment & Hosting

## 🔌 Companion Plugin

The WordPress AI Copilot requires a companion plugin to be installed on your WordPress sites. The plugin enables:

- Custom endpoints for wordpress agent tools like run sql queries, exporting data, plugin management, etc
- Secure API access to a wordpress site with api key authentication.

You can find the companion plugin in our [GitHub repository](https://github.com/wordpresscopilot/plugin).

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 16+
- MongoDB Database
- WordPress site with [WPC Plugin](https://github.com/wordpresscopilot/plugin) installed and the /wp-json/ api route enabled
- Clerk API keys
- Anthropic API key

### 1. Clone the repository

```shell
git clone https://github.com/wordpresscopilot/app.git wpcopilot-app
cd wpcopilot-app
```


### 2. Install npm dependencies

```shell
npm install
```

### 3. Copy the environment variables to `.env` and change the values

```shell
cp .env.example .env
```

### 4. Initialize the prisma database

```shell
npx prisma generate
```

### 5. Run the dev server

```shell
npm run dev
```

### 6. Open the app in your browser

Visit [http://localhost:3000](http://localhost:3000) in your browser.

