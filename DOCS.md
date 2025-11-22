# StockMaster - Inventory Management System

A modern, full-stack inventory management system built with Next.js 15, TypeScript, MongoDB, and Clerk authentication. StockMaster digitizes and streamlines all stock-related operations within a business.

## 🚀 Features

### Core Functionality
- **Real-time Stock Tracking** - Monitor inventory levels across multiple warehouses and locations
- **Role-based Access Control** - Admin and Staff roles with granular permissions
- **Receipt Management** - Track incoming stock from vendors
- **Delivery Operations** - Manage outgoing stock to customers
- **Internal Transfers** - Move stock between locations and warehouses
- **Stock Adjustments** - Fix discrepancies between recorded and physical stock
- **Move History** - Complete audit trail of all stock movements
- **Dashboard Analytics** - KPIs and insights for inventory health

### User Roles

#### Admin
- Full access to all operations
- Create/edit products, warehouses, and locations
- Validate receipts and deliveries
- Perform stock adjustments
- View all reports and analytics
- Manage system settings

#### Staff
- View-only access
- Monitor inventory levels
- Track operation status
- View reports
- Cannot modify stock or settings

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk (with email/password and OTP reset)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Validation**: Zod

## 📦 Project Structure

```
ims/
├── app/
│   ├── (dashboard)/          # Dashboard routes with navbar
│   │   ├── dashboard/        # Main dashboard page
│   │   ├── products/         # Product management
│   │   ├── stock/            # Stock view
│   │   ├── operations/       # Receipts, deliveries, transfers
│   │   ├── move-history/     # Stock movement history
│   │   └── settings/         # Settings and warehouses
│   ├── api/                  # API routes
│   │   ├── products/         # Product CRUD
│   │   ├── warehouses/       # Warehouse management
│   │   ├── locations/        # Location management
│   │   ├── receipts/         # Receipt operations
│   │   ├── deliveries/       # Delivery operations
│   │   └── dashboard/        # Dashboard KPIs
│   ├── sign-in/              # Sign in page
│   ├── sign-up/              # Sign up page
│   ├── select-role/          # Role selection page
│   └── layout.tsx            # Root layout with Clerk
├── components/
│   ├── ui/                   # shadcn components
│   └── navbar.tsx            # Main navigation
├── lib/
│   ├── db.ts                 # MongoDB connection
│   ├── auth.ts               # Auth helpers
│   ├── stock-manager.ts      # Stock operations
│   ├── reference-generator.ts # Reference number generator
│   └── utils.ts              # Utility functions
├── models/                   # Mongoose schemas
│   ├── Product.ts
│   ├── Warehouse.ts
│   ├── Location.ts
│   ├── Receipt.ts
│   ├── Delivery.ts
│   ├── Transfer.ts
│   ├── Adjustment.ts
│   ├── Stock.ts
│   └── StockLedger.ts
└── .env.local                # Environment variables
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or Atlas)
- Clerk account for authentication

### Installation

1. **Install dependencies** (already done)
```bash
npm install
```

2. **Set up environment variables**

Update `.env.local` file with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/stockmaster
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role
```

3. **Set up Clerk**
   - Go to [clerk.com](https://clerk.com) and create an account
   - Create a new application
   - Copy the publishable and secret keys to `.env.local`
   - Enable email/password authentication in Clerk dashboard
   - Enable "Email verification" and "Password reset" features

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env.local
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open the app**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### First Time Setup

1. **Sign Up**
   - Click "Get Started" on the home page
   - Enter your email and password
   - Verify your email via OTP

2. **Select Role**
   - After signing up, you'll be redirected to role selection
   - Choose either **Admin** or **Staff** based on your responsibilities
   - Admins have full access, Staff have view-only access

3. **Initial Configuration (Admin only)**
   - Create your first warehouse (Settings → Warehouses)
   - Add locations within the warehouse
   - Add products to your inventory

### Core Operations

#### Creating Products
1. Navigate to Products
2. Click "Add Product"
3. Fill in: Name, SKU, Category, Unit of Measure, Cost, Min Stock Level
4. Save

#### Receipt Operations (Incoming Stock)
1. Go to Operations → Receipts
2. Click "New Receipt"
3. Select vendor contact and destination location
4. Add products and quantities
5. Status flow: **Draft** → **Ready** → **Done** (validates and updates stock)

#### Delivery Operations (Outgoing Stock)
1. Go to Operations → Deliveries
2. Click "New Delivery"
3. Select customer contact and source location
4. Add products and quantities
5. Status flow: **Draft** → **Ready** → **Done** (reduces stock)

#### Stock Adjustments
1. Navigate to Operations → Adjustments
2. Click "New Adjustment"
3. Select product and location
4. Enter counted quantity (system shows recorded quantity)
5. Provide reason and validate

## 🏗️ Backend Architecture

### Database Models

**Product**
- Name, SKU, Category, Unit of Measure
- Per unit cost, Min stock level
- Created by user tracking

**Warehouse & Location**
- Warehouse has many Locations
- Short codes for reference generation
- Unique warehouse codes (e.g., WH1, WH2)

**Stock**
- Current inventory levels per product per location
- On-hand and free-to-use quantities
- Updated automatically by operations

**StockLedger**
- Immutable audit trail of all movements
- Links to source documents (receipts, deliveries, etc.)
- Tracks quantity changes and running balances

**Operations (Receipt, Delivery, Transfer)**
- Status workflow: draft → waiting → ready → done → canceled
- Product lines with quantities
- Reference numbers auto-generated (e.g., WH1/IN/0001)

### API Endpoints

#### Products
- `GET /api/products` - List products with pagination and search
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product with stock info
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

#### Warehouses & Locations
- `GET /api/warehouses` - List all warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/locations?warehouse=id` - List locations by warehouse
- `POST /api/locations` - Create location

#### Operations
- `GET /api/receipts?status=draft` - List receipts
- `POST /api/receipts` - Create receipt
- `PATCH /api/receipts/[id]` - Validate receipt (updates stock)
- Similar endpoints for deliveries and transfers

#### Dashboard
- `GET /api/dashboard?warehouse=id` - Get KPIs and recent activity

### Stock Management

The system uses a transactional approach for stock updates:
1. Operations create documents in draft status
2. When validated, stock is updated atomically
3. Both Stock (current levels) and StockLedger (history) are updated
4. Insufficient stock errors prevent negative inventory

## 🔒 Security & Authentication

### Clerk Integration
- Email/password authentication
- OTP-based password reset via email
- User metadata stores role (admin/staff)
- Session management handled by Clerk

### Role-based Access
- Middleware protects all routes except sign-in/sign-up
- API routes check authentication before processing
- Admin-only operations verified in backend
- Staff role prevents modifications

### Protected Routes
```typescript
// middleware.ts
publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"]
// All other routes require authentication
```

## 🎨 UI/UX Features

### Components
All UI built with shadcn/ui:
- Buttons, Inputs, Cards, Tables
- Dialogs, Dropdowns, Badges
- Forms with validation
- Navigation menu with active states

### Styling
- Tailwind CSS for responsive design
- Custom color schemes for different roles
- Hover states and transitions
- Mobile-friendly layouts

### Animations
- Framer Motion for smooth transitions
- Loading states and skeletons
- Toast notifications (can be added)

## 📊 Stock Flow Example

1. **Receive 100 units from vendor**
   - Create Receipt → Add product (100 units) → Set to Ready → Validate
   - Stock +100 at destination location
   - Ledger entry: `WH1/IN/0001 | +100 | Running: 100`

2. **Transfer 50 units to production floor**
   - Create Internal Transfer from WH1/Stock1 to WH1/Production
   - Stock at Stock1: -50, at Production: +50
   - Movement logged in ledger

3. **Deliver 30 units to customer**
   - Create Delivery → Validate
   - Stock -30 from source location
   - Ledger entry: `WH1/OUT/0001 | -30 | Running: 20`

4. **Adjust for 2 damaged items**
   - Recorded: 20, Counted: 18
   - Create Adjustment → Difference: -2 → Validate
   - Stock adjusted to 18
   - Reason: "Damaged during storage"

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally (`mongod`)
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address
- Test connection: `mongosh "your_connection_string"`

### Clerk Authentication Issues
- Verify API keys match your Clerk application
- Check that email verification is enabled
- Ensure redirect URLs in Clerk dashboard match your app
- Clear browser cache/cookies if stuck in redirect loop

### Role Not Set
- If redirected to `/select-role` repeatedly:
  - Clear browser cache
  - Check Clerk dashboard → Users → metadata
  - Manually set role in Clerk if needed

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`
- Verify all environment variables are set

## 🚀 Next Steps

### Features to Implement
1. **Products Page** - CRUD interface for products
2. **Stock Page** - View inventory levels by location
3. **Operations Pages** - Full UI for receipts, deliveries, transfers
4. **Move History** - View complete stock ledger
5. **Settings Page** - Manage warehouses and locations
6. **Reports** - PDF generation for operations
7. **Notifications** - Low stock alerts
8. **Batch Operations** - Import/export via CSV
9. **Barcode Scanning** - Mobile integration
10. **Analytics** - Charts and trends

### Recommended Enhancements
- Add toast notifications (react-hot-toast)
- Implement data tables with sorting/filtering (tanstack/table)
- Add form validation with react-hook-form + zod
- Create PDF reports with jsPDF
- Add charts with recharts or chart.js
- Implement real-time updates with websockets
- Add unit tests with Jest/Vitest
- Set up CI/CD pipeline

## 📄 License

MIT

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication infrastructure
- shadcn for beautiful UI components
- Vercel for deployment platform

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**

**Current Status**: Backend complete, Frontend foundation ready. Next: Build product and operations pages.
