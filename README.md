# NexRideX — Premium Luxury Marketplace & Admin Console

NexRideX is a production-ready, full-stack luxury vehicle marketplace and administration dashboard for hypercars, superbikes, private jets, and superyachts. 

It features premium glassmorphism layouts, robust CRUD management systems, automated discount pricing calculations, live status filtering, and dynamic database seeding.

---

## 📁 Repository Structure

The project is structured as a monorepo containing the following components:

```
NexRidex/
├── client/          # Frontend application (React, Vite, TanStack Router, Tailwind CSS)
├── server/          # Backend application (Node.js, Express, MongoDB, Mongoose)
│   └── data/        # Local development MongoDB database files (Ignored by Git)
├── package.json     # Root level scripts and dependencies
└── .gitignore       # Root level git rules mapping
```

> [!NOTE]  
> The **`data/`** directory is located inside the `server` folder (`server/data/db`). It stores the raw binary data for the local MongoDB daemon. Keeping it inside the server directory prevents configuration pollution in the `client` folder and is excluded from Git tracking via `.gitignore`.

---

## 🛠️ Local Development Setup

To spin up NexRideX locally on your environment, follow these steps:

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB Community Server** (v7.0+ or higher)

### 2. Environment Variables Configuration
Configure the required environment variables (such as database credentials and port numbers) inside a `.env` file located in the `server` directory before launching the app.

### 3. Running the Local MongoDB Daemon
If you are not running MongoDB as a background system service, you can run a local daemon pointing to the `server/data/db` directory:
```powershell
# Create db directory if it doesn't exist
mkdir server/data/db

# Start mongod on port 27017
mongod --dbpath "server/data/db" --port 27017
```

### 4. Seed the Database
Seed the MongoDB database:
```bash
# Navigate to server and run seed script
cd server
npm run seed
```

### 5. Running the Dev Servers
You can start both the client dev server and the backend API server:

- **Backend API Server (Port 5000)**:
  ```bash
  cd server
  npm run dev
  ```
- **Frontend Vite Client (Port 5173)**:
  ```bash
  cd client
  npm run dev
  ```

---

## 🌟 Key Features

### 1. Premium Inventory CRUD
- **Add Vehicle**: Supports field validations, category selection, and base64-encoded image file uploads.
- **Edit Vehicle**: Pre-fills fields with `originalPrice` (before discounts are calculated) so admins can edit the base listing prices seamlessly.
- **Delete Vehicle**: Warns admins with a premium glassmorphic confirmation modal before deletion and automatically clean up associated local image files on disk.

### 2. Linked Status & Discount System
- Select dropdown options for Category, Status, and Discount Percentage.
- **Linked State Updates**:
  - Selecting any discount percentage > 0% automatically changes the status to `"Discounted"`.
  - Changing the status to anything other than `"Discounted"` automatically resets the discount percentage to `0%`.

### 3. Dynamic Filtering & Badges
- Filter category grids (Cars, Bikes, Jets, Ships) dynamically by status tab-selectors.
- View premium status badges:
  - `Available` (Emerald Green)
  - `Sold` (Grayscale / Disabled interaction)
  - `Featured` (Purple Showcase)
  - `Discounted` (Rose Red displaying original vs. new price)
  - `Coming Soon` (Ocean Blue)
