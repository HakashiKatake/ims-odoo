# StockMaster Setup Guide

## Quick Start (5 minutes)

### Step 1: Configure Clerk Authentication

1. **Create Clerk Account**
   - Visit https://clerk.com and sign up
   - Create a new application
   - Choose "Email and Password" as authentication method

2. **Get API Keys**
   - In Clerk dashboard, go to "API Keys"
   - Copy the "Publishable Key" and "Secret Key"
   - Update `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```

3. **Enable Email Features**
   - Go to "Email, Phone, Username" settings
   - Enable "Email verification"
   - Enable "Password reset"
   - Save changes

### Step 2: Set up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env.local
MONGODB_URI=mongodb://localhost:27017/stockmaster
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add your IP to whitelist
4. Create database user
5. Get connection string
6. Update `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster
```

### Step 3: Run the Application

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## First Time Usage

### 1. Create Your Account

1. Click "Get Started" on the homepage
2. Enter your email and create a password
3. Verify your email (check inbox for OTP)
4. You'll be redirected to role selection

### 2. Select Your Role

**Choose Admin if you:**
- Need to create/modify inventory
- Will manage stock operations
- Need full system access

**Choose Staff if you:**
- Only need to view inventory
- Monitor operations status
- Generate reports

### 3. Initial Setup (Admin Only)

#### Create First Warehouse
1. Go to Settings → Warehouses
2. Click "Add Warehouse"
3. Fill in:
   - Name: "Main Warehouse"
   - Short Code: "WH1"
   - Address: Your warehouse address
4. Save

#### Add Locations
1. Go to Settings → Locations
2. Click "Add Location"
3. Fill in:
   - Name: "Stock Area 1"
   - Short Code: "STK1"
   - Warehouse: Select "Main Warehouse"
4. Repeat for other locations (e.g., Production, Shipping)

#### Add Your First Product
1. Go to Products
2. Click "Add Product"
3. Fill in:
   - Name: "Office Chair"
   - SKU: "CHR001"
   - Category: "Furniture"
   - Unit: "piece"
   - Cost: 150
   - Min Stock: 10
4. Save

## Common Tasks

### Receiving Stock from Vendor

1. Go to Operations → Receipts
2. Click "New Receipt"
3. Fill in:
   - Contact: "ABC Suppliers"
   - Destination: Select location
   - Schedule Date: Today
   - Add Products: Select products and quantities
4. Save as Draft
5. When ready, change status to "Ready"
6. Click "Validate" to update stock

### Delivering to Customer

1. Go to Operations → Deliveries
2. Click "New Delivery"
3. Fill in:
   - Contact: "Customer Name"
   - Source: Select location with stock
   - Delivery Address: Customer address
   - Add Products: Select products and quantities
4. Save as Draft
5. Change status to "Ready" when packed
6. Click "Validate" to reduce stock

### Adjusting Stock

1. Go to Operations → Adjustments
2. Click "New Adjustment"
3. Select Product and Location
4. System shows recorded quantity
5. Enter your counted quantity
6. Provide reason (e.g., "Physical count discrepancy")
7. Save and validate

## Environment Variables Reference

```env
# MongoDB - Required
MONGODB_URI=mongodb://localhost:27017/stockmaster

# Clerk - Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk URLs - Already configured
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role

# App URL - Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Issue: Can't sign in
**Solution:**
- Check Clerk API keys are correct
- Verify email verification is enabled in Clerk
- Clear browser cache and cookies

### Issue: Database connection failed
**Solution:**
- Check MongoDB is running: `brew services list`
- Verify MONGODB_URI in .env.local
- For Atlas, check IP whitelist

### Issue: Stuck on role selection
**Solution:**
- Clear browser cache
- Check Clerk dashboard → Users → your user → Metadata
- Manually add: `{"role": "admin"}` in public metadata

### Issue: Stock not updating
**Solution:**
- Ensure operation status is "Ready" before validating
- Check API responses in browser console
- Verify MongoDB connection is active

## Production Deployment

### 1. Update Environment Variables

In your hosting platform (Vercel, etc.):
```env
MONGODB_URI=your_atlas_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Update Clerk Settings

- Go to Clerk dashboard
- Update allowed redirect URLs to include production domain
- Switch to production keys

### 3. Deploy

```bash
# Build and test locally
npm run build
npm start

# Deploy to Vercel
vercel --prod
```

## Security Best Practices

1. **Never commit .env.local** - Already in .gitignore
2. **Use strong passwords** - For both app and MongoDB
3. **Enable 2FA** - In Clerk dashboard
4. **Regular backups** - Set up MongoDB backups
5. **Update dependencies** - Run `npm audit` regularly
6. **Use HTTPS** - In production (automatic with Vercel)
7. **Whitelist IPs** - For MongoDB Atlas

## Support

For issues:
1. Check this setup guide
2. Review DOCS.md for detailed information
3. Check browser console for errors
4. Review MongoDB logs
5. Check Clerk dashboard for auth issues

## Next Steps

After basic setup:
1. Customize product categories for your business
2. Set up multiple warehouses if needed
3. Define your operation workflow
4. Train staff on the system
5. Import existing inventory (build CSV import feature)
6. Set up regular stock counts
7. Configure low stock alerts

---

**Need Help?** Open an issue on the repository or check the documentation.
