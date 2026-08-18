#  A.T.L.A.S- Asset Tracking, Logistics and Administration System (Frontend UI).

[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)]()
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> A React single-page application built with **Vite** for hardware inventory tracking and IT support ticket management. Pairs with the [ATLAS backend API](../atlas-backend/README.md) to provide a full-stack asset and support-ticket workflow.

---

##  Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Setup & Running Locally](#️-setup--running-locally)
- [Project Structure](#-project-structure)
- [Screenshots](#-interface-screenshots)
- [Related](#-related)
- [Future Enhancements](#-future-enhancements)

---

##  Key Features

- **Interactive Dashboard** — Tabbed interface switching between Asset Management and Ticket Support views.
- **Real-Time Filtering** — Instantly search assets by name or serial number, and filter by operational status (`Available`, `In Use`, `Under Maintenance`).
- **JWT State Management** — Persists session state in `localStorage` with automated logout capabilities.
- **Dynamic Status Badges** — Color-coded priority and status flags for support ticket progression.

---

## Tech Stack

- **React 18** — component-driven UI
- **Vite** — dev server and build tooling
- **Fetch API** — HTTP requests to the ATLAS backend 
- **JWT** — token-based auth persisted in `localStorage`

---

## Setup & Running Locally

### 1. Prerequisites

- **Node.js (v18+)** and **npm**
- The [ATLAS backend API](../atlas-backend/README.md) running locally (see backend README for setup)

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation & Execution

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default (Vite's default port).

---

## 📁 Project Structure

```
atlas-frontend/
├── node_modules/
├── public/
├── screenshots/
├── src/
│   ├── assets/
│   ├── AddAssetModal.jsx    # Modal form for registering new hardware
│   ├── api.js                # API calls to the ATLAS backend
│   ├── App.css
│   ├── App.jsx                # Root component and routing
│   ├── AssetList.jsx          # Asset inventory table view
│   ├── EditAssetModal.jsx     # Modal form for editing existing assets
│   ├── index.css
│   ├── Login.jsx               # Authentication screen
│   ├── main.jsx                # App entry point
│   └── TicketManager.jsx       # Support ticket dashboard
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
└── vite.config.js
```

---

## 📸 Interface Screenshots

### 1. Login Page
Secure JWT-based authentication screen for accessing the ATLAS dashboard.
![Login Page](../Downloads/screenshots/login.png)

### 2. Administrative Dashboard
Overview of high-level metrics, active asset statuses, and logistics summaries.
![Administrative Dashboard](../Downloads/screenshots/dashboard.png)

### 3. Add Asset
Form view for registering new hardware into the inventory system.
![Add Asset](../Downloads/screenshots/add_asset.png)

### 4. Search, Filter & Sorting
Interactive data filtering by category, location, lifecycle state, and keyword search.
![Search and Filtering](../Downloads/screenshots/search_filter.png)

### 5. Support Ticket
Ticket creation and detail view linking a hardware asset to a raised support issue.
![Support Ticket](../Downloads/screenshots/support_ticket.png)

### 6. Ticket Status
Color-coded status and priority badges tracking a ticket's progression through its lifecycle.
![Ticket Status](../Downloads/screenshots/ticket_status.png)

---

## 🔗 Related

- [ATLAS Backend API](../atlas-backend/README.md)Node.js/Express/MongoDB REST API this frontend consumes.

---—

##  Future Enhancements

The frontend currently covers the core dashboard, asset, and ticketing workflows. Planned next steps focus on tightening access control, streamlining day-to-day asset handling, and giving admins better visibility and reporting:

- [ ] **Role-Based UI Views** — Restrict administrative actions (create/edit/delete) to Admin roles while presenting read-only views for general staff.
- [ ] **Barcode & QR Tag Scanning** — Integrate browser-based camera scanning to instantly check in/check out physical hardware assets.
- [ ] **Audit Trail & Activity Logs** — Real-time event log tracking every asset assignment, status change, and user interaction.
- [ ] **Pagination & Server-Side Filtering** — Handle large-scale enterprise inventory lists efficiently with server-side table pagination.
- [ ] **Automated Email Notifications** — Alert technicians automatically when a ticket priority is set to Urgent or an asset requires routine service.
- [ ] **Data Export Options** — Allow admins to export inventory reports and ticket logs as CSV or PDF documents.
- [ ] **Automated Testing** — Integrate React Testing Library and Cypress for end-to-end testing of core user workflows.