# StockMaster IMS - Complete Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Clerk account for authentication

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/stockmaster
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/stockmaster

# Clerk Authentication (Get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/select-role
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role
```

### 3. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable Email/Password authentication
4. Enable OTP for password reset
5. Copy your API keys to `.env.local`
6. In Clerk Dashboard → User & Authentication → Email, Phone, Username:
   - Enable "Email address"
   - Enable "Password"

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or download from https://www.mongodb.com/try/download/community

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Complete Testing Guide

### Step 1: Authentication Flow

1. **Sign Up**
   - Navigate to http://localhost:3000
   - Click "Get Started"
   - Sign up with email/password
   - Verify email (check console in dev mode)

2. **Role Selection**
   - After sign up, you'll be redirected to `/select-role`
   - Choose "Admin" for full access
   - Choose "Staff" for view-only access

3. **Sign In**
   - Sign out and sign back in
   - Verify role persists

### Step 2: Initial Data Setup

1. **Create Warehouses**
   - Go to Settings → Warehouses
   - Click "Add Warehouse"
   - Create at least 2 warehouses:
     ```
     Name: Main Warehouse
     Address: 123 Main St, City
     
     Name: Secondary Warehouse
     Address: 456 Oak Ave, City
     ```

2. **Create Locations**
   - Go to Settings → Locations
   - Click "Add Location"
   - Create locations for each warehouse:
     ```
     Warehouse: Main Warehouse
     Location: Aisle A-1
     
     Warehouse: Main Warehouse
     Location: Aisle B-2
     
     Warehouse: Secondary Warehouse
     Location: Zone 1
     ```

3. **Create Products**
   - Go to Products page
   - Click "Add Product"
   - Create sample products:
     ```
     Name: Laptop - Dell XPS 15
     SKU: DELL-XPS15 (will auto-uppercase)
     Category: Electronics
     Unit: piece
     Cost: 1299.99
     Min Stock: 5
     
     Name: Office Chair - Ergonomic
     SKU: CHAIR-ERG01
     Category: Furniture
     Unit: piece
     Cost: 299.99
     Min Stock: 10
     
     Name: Printer Paper A4
     SKU: PAPER-A4
     Category: Supplies
     Unit: ream
     Cost: 4.99
     Min Stock: 50
     ```

### Step 3: Stock Operations

1. **Create Receipt (Incoming Stock)**
   - Go to Operations → Receipts
   - Click "New Receipt"
   - Fill in:
     ```
     Vendor: TechSupply Co.
     Destination: Main Warehouse / Aisle A-1
     Schedule Date: Today's date
     Responsible: Your Name
     Product 1: Laptop - Dell XPS 15, Qty: 10
     Product 2: Office Chair - Ergonomic, Qty: 20
     ```
   - Click "Create Receipt"

2. **Validate Receipt**
   - Click "View" on the created receipt
   - Click "Mark as Ready"
   - Click "Validate Receipt"
   - ✅ Stock should now be added to inventory

3. **Verify Stock**
   - Go to Stock page
   - Should see:
     - Laptop: 10 units on hand
     - Chair: 20 units on hand
   - Check Move History
   - Should see ledger entries for the receipt

4. **Create Delivery (Outgoing Stock)**
   - Go to Operations → Deliveries
   - Click "New Delivery"
   - Fill in:
     ```
     Customer: ABC Company
     Source: Main Warehouse / Aisle A-1
     Schedule Date: Today's date
     Responsible: Your Name
     Product: Laptop - Dell XPS 15, Qty: 3
     ```
   - Create and validate delivery
   - ✅ Stock should decrease to 7 laptops

### Step 4: Dashboard Verification

1. Go to Dashboard
2. Verify KPI cards:
   - Total Products: 3
   - Total Stock: Should show total units
   - Low Stock Items: Count of products below min stock
   - Warehouses: 2
   - Receipts This Month: 1+
   - Deliveries This Month: 1+

### Step 5: Role-Based Access Testing

1. **As Admin:**
   - ✅ Can create/edit/delete products
   - ✅ Can create receipts and deliveries
   - ✅ Can validate operations
   - ✅ Can manage warehouses and locations

2. **As Staff (create new account):**
   - Sign up with different email
   - Select "Staff" role
   - ✅ Can view all data
   - ❌ Cannot create/edit/delete
   - Buttons should be hidden or disabled

### Step 6: Search & Filter Testing

1. **Products Page:**
   - Search for "laptop"
   - Should filter results

2. **Stock Page:**
   - Use warehouse filter
   - Search by SKU
   - Verify status badges (In Stock/Low Stock)

3. **Move History:**
   - Use date range filter
   - Filter by movement type (In/Out)
   - Search by product name
   - Export to CSV

### Step 7: Edge Cases

1. **Low Stock Alert:**
   - Create delivery to bring stock below min level
   - Dashboard should show low stock count
   - Stock page should show "Low Stock" badge

2. **Empty States:**
   - Clear all filters
   - Verify empty state messages display

3. **Form Validation:**
   - Try creating product without name
   - Try creating receipt without selecting location
   - Verify error messages

---

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If connection fails, check MONGODB_URI format
# Local: mongodb://localhost:27017/stockmaster
# Atlas: mongodb+srv://username:password@cluster.xxx.mongodb.net/stockmaster
```

### Clerk Authentication Issues
- Verify API keys are correct
- Check Clerk Dashboard → API Keys
- Ensure environment variables start with `NEXT_PUBLIC_` for client-side
- Clear browser cookies and try again

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Stock Not Updating
- Check browser console for errors
- Verify receipt/delivery status is "done"
- Check StockLedger collection in MongoDB
- Ensure product and location IDs are valid

---

## 📁 Project Structure

```
ims/
├── app/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── products/          # Products management
│   │   ├── stock/             # Stock view
│   │   ├── operations/        # Receipts, Deliveries, Transfers
│   │   ├── move-history/      # Stock ledger
│   │   └── settings/          # Warehouses, Locations
│   ├── api/                   # API routes
│   │   ├── products/
│   │   ├── stock/
│   │   ├── receipts/
│   │   ├── deliveries/
│   │   ├── warehouses/
│   │   ├── locations/
│   │   ├── dashboard/
│   │   └── stock-ledger/
│   ├── sign-in/               # Clerk sign-in page
│   ├── sign-up/               # Clerk sign-up page
│   ├── select-role/           # Role selection page
│   ├── layout.tsx             # Root layout with Clerk
│   └── page.tsx               # Landing page
├── components/
│   ├── navbar.tsx             # Main navigation
│   └── ui/                    # shadcn components
├── lib/
│   ├── db.ts                  # MongoDB connection
│   ├── auth.ts                # Auth helpers
│   ├── stock-manager.ts       # Stock operations
│   └── reference-generator.ts # Auto-generate references
├── models/                    # Mongoose schemas
│   ├── Product.ts
│   ├── Warehouse.ts
│   ├── Location.ts
│   ├── Stock.ts
│   ├── StockLedger.ts
│   ├── Receipt.ts
│   ├── Delivery.ts
│   ├── Transfer.ts
│   └── Adjustment.ts
├── middleware.ts              # Clerk auth middleware
└── TESTING_CHECKLIST.md       # Complete testing checklist
```

---

## 🎯 Key Features Implemented

### ✅ Authentication & Authorization
- Email/password authentication via Clerk
- OTP-based password reset
- Role-based access (Admin/Staff)
- Protected routes with middleware

### ✅ Inventory Management
- Products CRUD with SKU validation
- Warehouse and location management
- Real-time stock tracking
- Low stock alerts

### ✅ Operations
- Receipts (incoming stock) with status workflow
- Deliveries (outgoing stock) with stock deduction
- Auto-generated reference numbers
- Status transitions (Draft → Ready → Done)

### ✅ Reporting & History
- Dashboard with 6 KPIs
- Stock view with filtering
- Complete move history audit trail
- CSV export capability

### ✅ UI/UX
- Responsive design (mobile/tablet/desktop)
- shadcn/ui components
- Loading states
- Empty states
- Error handling
- Search and filters

---

## 📊 Database Models

### Product
- Name, SKU (unique), Category
- Unit of Measure, Per Unit Cost
- Min Stock Level
- Text search indexes

### Stock
- Product, Location (compound unique)
- On Hand, Free to Use quantities
- Automatic updates via stock-manager

### StockLedger
- Immutable audit trail
- Movement Type (in/out/adjustment/transfer)
- Source Document references
- Indexed on product/location/date

### Receipt/Delivery
- Reference (auto-generated)
- Contact, Responsible
- Status workflow
- Product lines with quantities

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production
- `MONGODB_URI` - MongoDB Atlas connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- Update Clerk redirect URLs to production domain

---

## 📝 API Documentation

All API endpoints require authentication. Include Clerk session token in requests.

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Stock
- `GET /api/stock?warehouse=[id]` - Get stock grouped by product

### Receipts
- `GET /api/receipts?status=[status]` - List receipts
- `POST /api/receipts` - Create receipt
- `GET /api/receipts/[id]` - Get receipt
- `PATCH /api/receipts/[id]` - Update receipt status

### Deliveries
- `GET /api/deliveries?status=[status]` - List deliveries
- `POST /api/deliveries` - Create delivery
- `GET /api/deliveries/[id]` - Get delivery
- `PATCH /api/deliveries/[id]` - Update delivery status

### Dashboard
- `GET /api/dashboard` - Get all KPIs

### Stock Ledger
- `GET /api/stock-ledger?limit=[n]&movementType=[type]` - Get movements

---

## 📞 Support

For issues or questions:
1. Check the TESTING_CHECKLIST.md
2. Review error logs in browser console
3. Check MongoDB collections for data
4. Verify Clerk dashboard for auth issues

---

**Built with:** Next.js 15, TypeScript, MongoDB, Clerk, shadcn/ui, Tailwind CSS 4

**Last Updated:** December 2024
