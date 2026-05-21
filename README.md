# 🛒 Amazon UI Regression Suite

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> **Black-box end-to-end regression suite** automating critical user flows on Amazon.com using Playwright + TypeScript, Page Object Model architecture, bot evasion techniques, and Allure reporting.

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

---

## 🎯 Overview

This suite automates and validates **4 critical user journeys** on Amazon.com:

| Flow | Description | Tests |
|------|-------------|-------|
| 🔍 **Search** | Product search with keyword validation | TC01, TC02, TC03 |
| 🎛️ **Filters** | Price range and sort order filtering | TC04, TC05 |
| 🛒 **Cart** | Add to cart and cart navigation | TC06, TC07 |
| 💰 **Subtotal** | Subtotal display and cart state validation | TC08, TC09 |

The suite runs automatically on every push via **GitHub Actions** and generates a full **Allure Report** with screenshots and traces on failure.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test development |
| [playwright-extra](https://github.com/berstend/puppeteer-extra) | Playwright plugin system |
| [playwright-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) | Bot detection evasion |
| [Allure Reports](https://allurereport.org/) | Rich HTML test reporting |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline automation |

---

## 📁 Project Structure

```
amazon-ui-regression-suite/
├── .github/
│   └── workflows/
│       └── regression.yml        # CI pipeline — runs on push + schedule
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── HomePage.ts           # Search bar, navigation
│   │   ├── SearchResultsPage.ts  # Results grid, filters, sort
│   │   ├── ProductPage.ts        # PDP, add to cart
│   │   └── CartPage.ts           # Cart items, subtotal
│   ├── tests/
│   │   ├── search.spec.ts        # TC01–TC03
│   │   ├── filters.spec.ts       # TC04–TC05
│   │   ├── cart.spec.ts          # TC06–TC07
│   │   └── subtotal.spec.ts      # TC08–TC09
│   ├── utils/
│   │   ├── stealthHelper.ts      # Bot evasion + human simulation
│   │   └── waitHelper.ts         # Dynamic content handlers
│   └── fixtures/
│       └── testData.ts           # Centralized test data
├── playwright.config.ts          # Global Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## ✅ Test Coverage

| ID | Test Case | Flow | Status |
|----|-----------|------|--------|
| TC01 | Display results for valid search | Search | ✅ |
| TC02 | Results match search keyword | Search | ✅ |
| TC03 | Sort results by price low-high | Search | ✅ |
| TC04 | Filter by price range | Filters | ✅ |
| TC05 | Maintain results after sort + filter | Filters | ✅ |
| TC06 | Add product to cart | Cart | ✅ |
| TC07 | Navigate to cart page | Cart | ✅ |
| TC08 | Display subtotal in cart | Subtotal | ✅ |
| TC09 | Show empty cart message | Subtotal | ✅ |

---

## 🏗️ Architecture

### Page Object Model

Each page is encapsulated in its own class with typed locators and action methods, keeping tests clean and maintainable:

```typescript
const home = new HomePage(page);
const results = new SearchResultsPage(page);

await home.navigate();
await home.searchFor("wireless headphones");
await results.waitForResults();
await results.sortBy("price-asc-rank");
```

### Bot Evasion Strategy

Amazon actively detects automation. This suite applies multiple stealth layers:

- **`navigator.webdriver` override** — hides the automation flag
- **Human-like typing delays** — randomized keystroke intervals (50–150ms)
- **Random delays between actions** — simulates real user think time
- **Realistic browser fingerprint** — plugins, languages, permissions spoofing
- **US locale + timezone** — matches expected browser profile

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
# Run full suite
npm test

# Run with browser visible
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

Artifacts (screenshots, videos, traces) are automatically captured on failure and attached to the report.

---

## ⚙️ CI/CD Pipeline

The suite runs automatically on:
- Every **push** to `main`
- Every **pull request** to `main`
- **Scheduled** Monday–Friday at 8:00 AM UTC

Reports are uploaded as GitHub Actions artifacts and retained for 30 days.

---

## 🤖 Bot Evasion Strategy

| Layer | Technique |
|-------|-----------|
| Navigator API | `webdriver` flag override |
| Typing behavior | Per-character random delays |
| Action timing | Random delays between steps |
| Browser profile | Plugins + language spoofing |
| Permissions API | `notifications` query patching |

## ⚠️ Known CI Limitations

Tests running in GitHub Actions will partially fail on flows that require
Amazon's homepage (`#twotabsearchtextbox`), as Amazon actively blocks
requests from known datacenter IP ranges (AWS/GitHub infrastructure).

| Environment | Expected Results |
|-------------|-----------------|
| Local machine | ✅ All 9 tests pass |
| GitHub Actions | ✅ TC07, TC08, TC09 pass — others blocked by Amazon bot detection |

This is **intentional and documented behavior**, not a bug in the suite.
To run the full suite locally: `npm run test:headed`

> ⚠️ This suite is built for **educational and portfolio purposes only**. Always respect a website's Terms of Service and `robots.txt`.

---

## 📄 License

MIT © [VladimirRamirez07](https://github.com/VladimirRamirez07)