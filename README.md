# 🛒 Amazon UI Regression Suite

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Reports-FF6B35?style=for-the-badge&logoColor=white)
![Amazon](https://img.shields.io/badge/Amazon-FF9900?style=for-the-badge&logo=amazon&logoColor=white)
![Chrome](https://img.shields.io/badge/Chromium-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-9%20passing-brightgreen?style=for-the-badge)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

> **Production-grade black-box end-to-end regression suite** automating critical user flows on Amazon.com — built with Playwright + TypeScript, Page Object Model architecture, multi-region bot evasion, and full Allure reporting pipeline.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Test Coverage](#-test-coverage)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Running Tests](#️-running-tests)
- [Reports](#-reports)
- [CI/CD Pipeline](#️-cicd-pipeline)
- [Bot Evasion Strategy](#-bot-evasion-strategy)
- [Known CI Limitations](#️-known-ci-limitations)

---

## 🎯 Overview

This suite automates and validates **4 critical user journeys** on Amazon.com against a live production environment, handling real-world challenges such as bot detection, dynamic async content, region-specific UI variations, and geo-based popups.

| Flow | Description | Tests |
|------|-------------|-------|
| 🔍 **Search** | Product search with keyword and sort validation | TC01, TC02, TC03 |
| 🎛️ **Filters** | Free shipping filter and sort order persistence | TC04, TC05 |
| 🛒 **Cart** | Add to cart flow and cart navigation | TC06, TC07 |
| 💰 **Subtotal** | Subtotal display and cart state validation | TC08, TC09 |

The suite runs automatically on every push via **GitHub Actions**, generates a full **Allure Report** with screenshots, videos and traces on failure, and is designed to handle Amazon's regional UI differences (tested against `amazon.com` from Costa Rica).

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Playwright](https://playwright.dev/) | Latest | Browser automation framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe test development |
| [Node.js](https://nodejs.org/) | 20.x | Runtime environment |
| [playwright-extra](https://github.com/berstend/puppeteer-extra) | Latest | Playwright plugin system |
| [playwright-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) | Latest | Bot detection evasion |
| [Allure Reports](https://allurereport.org/) | Latest | Rich HTML test reporting |
| [GitHub Actions](https://github.com/features/actions) | - | CI/CD pipeline automation |

---

## 📁 Project Structure

```
amazon-ui-regression-suite/
├── .github/
│   └── workflows/
│       └── regression.yml        # CI pipeline — runs on push + schedule
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── HomePage.ts           # Search bar, navigation, cart count
│   │   ├── SearchResultsPage.ts  # Results grid, filters, sort, popup handling
│   │   ├── ProductPage.ts        # PDP, add to cart, variant handling
│   │   └── CartPage.ts           # Cart items, subtotal verification
│   ├── tests/
│   │   ├── search.spec.ts        # TC01–TC03: Search flow
│   │   ├── filters.spec.ts       # TC04–TC05: Filter and sort flow
│   │   ├── cart.spec.ts          # TC06–TC07: Cart flow
│   │   └── subtotal.spec.ts      # TC08–TC09: Subtotal verification
│   ├── utils/
│   │   ├── stealthHelper.ts      # Bot evasion + human behavior simulation
│   │   └── waitHelper.ts         # Dynamic content handlers
│   └── fixtures/
│       └── testData.ts           # Centralized test data
├── playwright.config.ts          # Global Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## ✅ Test Coverage

| ID | Test Case | Flow | Local | CI |
|----|-----------|------|-------|----|
| TC01 | Display results for valid search | Search | ✅ | ❌ Bot detection |
| TC02 | Results match search keyword (multilingual) | Search | ✅ | ❌ Bot detection |
| TC03 | Sort results by price low to high | Search | ✅ | ❌ Bot detection |
| TC04 | Filter results by free shipping | Filters | ✅ | ❌ Bot detection |
| TC05 | Maintain results after sort + filter | Filters | ✅ | ❌ Bot detection |
| TC06 | Add product to cart | Cart | ✅ | ❌ Bot detection |
| TC07 | Navigate to cart page | Cart | ✅ | ✅ |
| TC08 | Display subtotal in cart | Subtotal | ✅ | ✅ |
| TC09 | Show empty cart message | Subtotal | ✅ | ✅ |

**Local: 9/9 ✅ — CI: 3/9 ✅** (see [Known CI Limitations](#️-known-ci-limitations))

---

## 🏗️ Architecture

### Page Object Model

Each page is encapsulated in its own class with typed locators and action methods, keeping tests readable, maintainable, and DRY:

```typescript
const home = new HomePage(page);
const results = new SearchResultsPage(page);

await home.navigate();
await home.searchFor("wireless headphones");
await results.waitForResults();
await results.sortBy("price-asc-rank");
```

### Multi-Region Resilience

The suite is designed to handle Amazon's regional UI variations:

- **Geo-popup dismissal** — automatically detects and closes location popups in English and Spanish
- **Multilingual assertions** — keyword matching supports `laptop | portátil | notebook`
- **Flexible selectors** — multiple fallback selectors for region-specific UI differences
- **Locale configuration** — `es-CR` locale with `America/Costa_Rica` timezone

### Human Behavior Simulation

```typescript
// Randomized delays between actions
await humanDelay(800, 1500);

// Per-character typing with random intervals
await humanType(page, selector, "wireless headphones");
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/VladimirRamirez07/amazon-ui-regression-suite.git
cd amazon-ui-regression-suite
npm install
npx playwright install chromium
```

---

## ▶️ Running Tests

```bash
# Run full suite (headless)
npm test

# Run with browser visible — recommended for demo
npm run test:headed

# Run specific flow
npm run test:search
npm run test:filters
npm run test:cart
npm run test:subtotal
```

---

## 📊 Reports

### Allure Report
```bash
npm run report:allure
```

### Playwright HTML Report
```bash
npm run report:playwright
```

On failure, the following artifacts are automatically captured and attached to the report:

- 📸 **Screenshots** — captured at moment of failure
- 🎥 **Videos** — full test recording retained on failure
- 🔍 **Traces** — step-by-step Playwright trace for debugging

---

## ⚙️ CI/CD Pipeline

The suite runs automatically on:

- Every **push** to `main`
- Every **pull request** to `main`
- **Scheduled** Monday–Friday at 8:00 AM UTC

Allure and Playwright reports are uploaded as GitHub Actions artifacts and retained for **30 days**.

---

## 🤖 Bot Evasion Strategy

Amazon uses sophisticated multi-layer bot detection. This suite addresses it at every level:

| Layer | Technique | Implementation |
|-------|-----------|----------------|
| Navigator API | `webdriver` flag suppression | `stealthHelper.ts` |
| Typing behavior | Per-character random delays (50–150ms) | `humanType()` |
| Action timing | Random delays between steps (500–1500ms) | `humanDelay()` |
| Browser fingerprint | Plugins + language spoofing | `addInitScript()` |
| Permissions API | `notifications` query patching | `addInitScript()` |
| Geo-popups | Auto-dismiss in EN/ES | `dismissLocationPopupIfPresent()` |
| Locale | Region-aware `es-CR` config | `playwright.config.ts` |

---

## ⚠️ Known CI Limitations

Tests running in GitHub Actions partially fail on flows that require Amazon's homepage navigation, as Amazon actively blocks requests originating from known datacenter IP ranges (AWS/GitHub infrastructure).

| Environment | Results | Details |
|-------------|---------|---------|
| 💻 Local machine | ✅ **9/9 passing** | Full suite runs successfully |
| ☁️ GitHub Actions | ✅ **3/9 passing** | TC07, TC08, TC09 pass — others blocked by Amazon bot detection |

This is **intentional and documented behavior**, demonstrating real-world understanding of bot detection in automated testing environments.

To run the full suite locally:
```bash
npm run test:headed
```

> ⚠️ This suite is built for **educational and portfolio purposes only**. Always respect a website's Terms of Service and `robots.txt`.

---

## 📄 License

MIT © [VladimirRamirez07](https://github.com/VladimirRamirez07)