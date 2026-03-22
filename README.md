# hldrs_automation

> Automated bot infrastructure for the **hldrs** RuneScape clan — powering Discord & Twitch integrations through a fully automated CI/CD pipeline.

---

## Overview

This repository contains the bot automation suite for the **hldrs** RS clan. It manages deployment of the clan's Discord and Twitch bots via GitHub Actions, with built-in testing, linting, and scheduled re-deployment to keep everything running smoothly.

---

## Workflow

### CI/CD Pipeline — `.github/workflows/discord.yaml`

The pipeline triggers on:

| Event | Branches |
|---|---|
| `push` | `main`, `develop` |
| `pull_request` | `main` |
| `schedule` | Every 6 hours (`0 */6 * * *`) |

#### Pipeline Stages

```
┌─────────┐     ┌────────────────┐     ┌────────────────┐
│  test   │────▶│ deploy-discord │     │ deploy-twitch  │
│         │     │  (main only)   │     │  (main only)   │
└─────────┘     └────────────────┘     └────────────────┘
      │                                        ▲
      └────────────────────────────────────────┘
```

**1. `test` — runs on every push & PR**
- Installs dependencies (`npm ci`)
- Runs linter (`npm run lint`)
- Runs test suite (`npm run test`)
- Checks code coverage (`npm run coverage`)

**2. `deploy-discord` — runs on `main` only, after tests pass**
- Deploys the clan Discord bot using `DISCORD_TOKEN` and `DISCORD_CLIENT_ID`

**3. `deploy-twitch` — runs on `main` only, after tests pass**
- Deploys the Twitch bot using `TWITCH_ACCESS_TOKEN` and `TWITCH_CLIENT_ID`

Both deploy jobs run in parallel once the test stage passes.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- `npm`
- Access to the clan's bot credentials (see [Secrets](#secrets))

### Local Setup

```bash
# Clone the repo
git clone https://github.com/adicarlisle/hldrs_automation.git
cd hldrs_automation

# Install dependencies
npm ci

# Run tests locally
npm run test

# Run linter
npm run lint
```

### Running Bots Locally

Create a `.env` file in the project root (never commit this):

```env
# Discord
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id

# Twitch
TWITCH_ACCESS_TOKEN=your_twitch_access_token
TWITCH_CLIENT_ID=your_twitch_client_id
```

Then deploy individually:

```bash
npm run deploy:discord
npm run deploy:twitch
```

---

## Secrets

The following secrets must be configured in the GitHub repository settings under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from the Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Application client ID from the Discord Developer Portal |
| `TWITCH_ACCESS_TOKEN` | OAuth access token from Twitch Developer Console |
| `TWITCH_CLIENT_ID` | Client ID from Twitch Developer Console |

Only repository admins can manage secrets. Contact a clan admin if you need access.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — triggers full deploy |
| `develop` | Staging / active development — triggers tests only |

All changes should go through a pull request into `main`. Direct pushes to `main` are reserved for hotfixes.

---

## Contributing

1. Branch off `develop`
2. Make your changes
3. Ensure `npm run lint` and `npm run test` pass locally
4. Open a PR targeting `main`
5. Pipeline will run automatically — deploy happens on merge

---

## Links

- Repository: [github.com/adicarlisle/hldrs_automation](https://github.com/adicarlisle/hldrs_automation)
- Discord Developer Portal: [discord.com/developers](https://discord.com/developers/applications)
- Twitch Developer Console: [dev.twitch.tv](https://dev.twitch.tv/console)