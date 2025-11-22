# StockMaster IMS

A comprehensive Inventory Management System built with Next.js 15, TypeScript, MongoDB, Clerk Authentication, and shadcn/ui.

## ✨ Features

- 🔐 **Authentication** - Email/password + OTP reset via Clerk
- 👥 **Role-Based Access** - Admin (full access) and Staff (view-only)
- 📦 **Products Management** - CRUD with SKU validation
- 🏭 **Warehouses & Locations** - Multi-warehouse inventory tracking
- 📊 **Stock Tracking** - Real-time inventory levels with low stock alerts
- 📥 **Receipts** - Incoming stock with status workflow
- 📤 **Deliveries** - Outgoing stock with automatic deduction
- 📜 **Move History** - Complete audit trail with CSV export
- 📈 **Dashboard** - 6 KPIs with real-time data
- 🔍 **Search & Filters** - Advanced filtering on all pages
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/select-role
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full setup instructions with MongoDB and Clerk configuration
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing guide
- **[PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md)** - Complete feature list and project details

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** Clerk v5
- **UI:** shadcn/ui + Tailwind CSS 4
- **Icons:** Lucide React
- **Date Utils:** date-fns

## 📁 Project Structure

```
ims/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── products/         # Products CRUD
│   │   ├── stock/            # Stock view
│   │   ├── operations/       # Receipts & Deliveries
│   │   ├── move-history/     # Stock ledger
│   │   └── settings/         # Warehouses & Locations
│   ├── api/                  # API routes
│   └── (auth)/               # Sign-in, Sign-up, Role selection
├── components/               # React components
├── lib/                      # Utilities & business logic
├── models/                   # Mongoose schemas (9 models)
└── middleware.ts             # Clerk auth middleware
```

## 🔑 Key Concepts

### Stock Management
- **On-Hand Quantity:** Total physical stock
- **Free-to-Use Quantity:** Available for allocation
- **Stock Ledger:** Immutable audit trail of all movements

### Operations Workflow
1. **Draft** - Create operation
2. **Ready** - Mark ready for processing
3. **Done** - Validate and update stock

### Roles
- **Admin:** Full CRUD access
- **Staff:** View-only access

## 🧪 Testing

1. Create admin account
2. Add warehouses and locations (Settings)
3. Create products (Products page)
4. Create receipt (Operations → Receipts)
5. Validate receipt to add stock
6. View stock levels (Stock page)
7. Create delivery to remove stock
8. Check move history for audit trail

See `TESTING_CHECKLIST.md` for complete testing procedures.

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Environment Variables
Set in Vercel dashboard:
- `MONGODB_URI` - MongoDB Atlas connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

Update Clerk redirect URLs to your production domain.

## 📊 Database Models

1. **Product** - SKU, name, category, unit, cost, min stock
2. **Warehouse** - Name, address
3. **Location** - Name, warehouse reference
4. **Stock** - Product-location inventory
5. **StockLedger** - Movement history (immutable)
6. **Receipt** - Incoming stock operations
7. **Delivery** - Outgoing stock operations
8. **Transfer** - Inter-location transfers
9. **Adjustment** - Stock adjustments

## 🎯 API Endpoints

- `GET /api/products` - List products
- `GET /api/stock` - Get stock with grouping
- `GET /api/receipts` - List receipts
- `POST /api/receipts` - Create receipt
- `PATCH /api/receipts/[id]` - Update receipt status
- `GET /api/deliveries` - List deliveries
- `GET /api/dashboard` - Get KPIs
- `GET /api/stock-ledger` - Movement history

All endpoints require authentication.

## 🤝 Contributing

This is a complete, production-ready project. For enhancements:
1. Fork the repository
2. Create feature branch
3. Test thoroughly
4. Submit pull request

## 📝 License

MIT

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication
- shadcn for beautiful UI components
- Vercel for hosting

---

**Built with ❤️ using Next.js, TypeScript, MongoDB, and Clerk**

For detailed setup and testing instructions, see:
- [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Project Summary](./PROJECT_COMPLETION_SUMMARY.md)
