# StockMaster IMS - Testing Checklist

## Overview
Complete testing checklist for the StockMaster Inventory Management System built with Next.js, MongoDB, Clerk Auth, and shadcn/ui.

## Environment Setup
- [x] MongoDB connection configured
- [x] Clerk authentication keys set up
- [x] All dependencies installed
- [x] Database models created

## Authentication & Authorization

### Clerk Authentication
- [ ] Sign up with email/password
- [ ] Sign in with existing credentials
- [ ] OTP-based password reset
- [ ] Sign out functionality
- [ ] Session persistence

### Role-Based Access Control
- [ ] Admin role can access all features
- [ ] Staff role has view-only access
- [ ] Role selection page works
- [ ] Role metadata stored correctly in Clerk
- [ ] Protected routes redirect unauthenticated users
- [ ] Navbar shows correct user role

## Core Pages

### Landing Page (/)
- [ ] Hero section displays correctly
- [ ] Features cards render properly
- [ ] CTA buttons navigate to sign-up
- [ ] Responsive layout on mobile/tablet

### Dashboard (/dashboard)
- [ ] 6 KPI cards display:
  - Total Products
  - Total Stock
  - Low Stock Items
  - Warehouses
  - Receipts (This Month)
  - Deliveries (This Month)
- [ ] Cards show real-time data
- [ ] Navigation cards work correctly
- [ ] Loading states work

### Products Page (/products)
- [ ] Products list displays in table
- [ ] Search functionality works
- [ ] Create new product (Admin)
  - Name field validation
  - SKU auto-uppercase
  - Category selection
  - Unit of measure
  - Per unit cost
  - Min stock level
- [ ] Edit existing product (Admin)
- [ ] Delete product with confirmation (Admin)
- [ ] View-only mode for Staff
- [ ] Real-time table updates after CRUD

### Stock View (/stock)
- [ ] Stock grouped by product
- [ ] Warehouse filter dropdown works
- [ ] Search by product name/SKU
- [ ] Status badges (In Stock/Low Stock/Out of Stock)
- [ ] Location breakdown shows correctly
- [ ] KPI cards update based on filters
- [ ] Displays on-hand and available quantities

### Operations - Receipts

#### List Page (/operations/receipts)
- [ ] All receipts display in table
- [ ] Status filter dropdown works (Draft/Waiting/Ready/Done/Canceled)
- [ ] Date formatting correct
- [ ] Product count shows
- [ ] "New Receipt" button navigates correctly
- [ ] "View" button opens detail page

#### Create Page (/operations/receipts/new)
- [ ] Form fields render correctly
- [ ] Vendor contact field
- [ ] Destination location dropdown populated
- [ ] Schedule date picker
- [ ] Responsible person field
- [ ] Add/remove product lines
- [ ] Product selection dropdown
- [ ] Quantity input validation
- [ ] Create button submits successfully
- [ ] Redirects to list after creation
- [ ] Error handling for failed creation

#### Detail Page (/operations/receipts/:id)
- [ ] Receipt information displays
- [ ] Status badge shows correctly
- [ ] "Mark as Ready" button (Draft status)
- [ ] "Validate Receipt" button (Ready status)
- [ ] Products table shows all items
- [ ] Timeline shows created/updated dates
- [ ] Back button navigates correctly
- [ ] Status updates work correctly
- [ ] Stock updates on validation (Done status)

### Operations - Deliveries

#### List Page (/operations/deliveries)
- [ ] All deliveries display
- [ ] Status filter works
- [ ] Source location shows
- [ ] Empty state renders

#### Create Page (/operations/deliveries/new)
- [ ] Customer contact field
- [ ] Source location dropdown
- [ ] Product lines management
- [ ] Form submission works

#### Detail Page (/operations/deliveries/:id)
- [ ] Delivery info displays
- [ ] Status workflow works
- [ ] Stock deduction on validation

### Move History (/move-history)
- [ ] All stock movements display
- [ ] Search by product/SKU/reference
- [ ] Movement type filter (In/Out/Adjustment/Transfer)
- [ ] Date range filter (Start/End date)
- [ ] Export to CSV works
- [ ] Movement badges color-coded correctly
- [ ] Quantity shows +/- correctly
- [ ] Empty state when no results

### Settings

#### Warehouses (/settings/warehouses)
- [ ] Warehouses list displays
- [ ] Create new warehouse (Admin)
- [ ] Edit warehouse (Admin)
- [ ] Delete warehouse (Admin)
- [ ] Staff has view-only access
- [ ] Empty state renders

#### Locations (/settings/locations)
- [ ] Locations list with warehouse name
- [ ] Warehouse dropdown in form
- [ ] Create new location (Admin)
- [ ] Edit location (Admin)
- [ ] Delete location (Admin)
- [ ] Staff has view-only access

## API Endpoints Testing

### Products API (/api/products)
- [ ] GET - List all products
- [ ] POST - Create product (requires auth)
- [ ] PUT - Update product (requires auth)
- [ ] DELETE - Delete product (requires auth)
- [ ] Validation errors handled

### Warehouses API (/api/warehouses)
- [ ] GET - List all warehouses
- [ ] POST - Create warehouse
- [ ] PUT - Update warehouse
- [ ] DELETE - Delete warehouse

### Locations API (/api/locations)
- [ ] GET - List all locations (populated with warehouse)
- [ ] POST - Create location
- [ ] PUT - Update location
- [ ] DELETE - Delete location

### Stock API (/api/stock)
- [ ] GET - Returns grouped stock by product
- [ ] Warehouse filter parameter works
- [ ] Product details populated
- [ ] Location array contains all stocks
- [ ] Totals calculated correctly

### Receipts API (/api/receipts)
- [ ] GET - List all receipts
- [ ] POST - Create receipt (auto-generates reference)
- [ ] GET /:id - Get single receipt
- [ ] PATCH /:id - Update receipt status
- [ ] Status transitions validated
- [ ] Stock updated on "done" status
- [ ] StockLedger entry created

### Deliveries API (/api/deliveries)
- [ ] GET - List all deliveries
- [ ] POST - Create delivery
- [ ] GET /:id - Get single delivery
- [ ] PATCH /:id - Update delivery status
- [ ] Stock deducted on "done" status

### Dashboard API (/api/dashboard)
- [ ] Total products count
- [ ] Total stock calculation
- [ ] Low stock items count
- [ ] Warehouses count
- [ ] Receipts this month
- [ ] Deliveries this month

### Stock Ledger API (/api/stock-ledger)
- [ ] GET - Returns all movements
- [ ] Limit parameter works
- [ ] Product filter works
- [ ] Location filter works
- [ ] Movement type filter works
- [ ] Sorted by date descending

## Database Operations

### Stock Management
- [ ] Stock levels update correctly on receipt validation
- [ ] Stock deducted on delivery validation
- [ ] StockLedger entries created for all movements
- [ ] Low stock detection works (below minStockLevel)
- [ ] freeToUse vs onHand tracked separately

### Data Integrity
- [ ] SKU uniqueness enforced
- [ ] Product-Location stock uniqueness enforced
- [ ] References generated correctly (REC-*, DEL-*)
- [ ] Mongoose validation errors handled
- [ ] Relationships properly populated

## UI/UX

### Responsive Design
- [ ] Desktop layout (1920px)
- [ ] Laptop layout (1440px)
- [ ] Tablet layout (768px)
- [ ] Mobile layout (375px)
- [ ] Navigation menu adapts

### Loading States
- [ ] Skeleton/loading indicators on data fetch
- [ ] Button disabled states during submit
- [ ] Empty states with helpful messages

### Error Handling
- [ ] Form validation errors display
- [ ] API errors shown to user
- [ ] Network errors handled gracefully
- [ ] 404 pages for invalid routes

### Accessibility
- [ ] Form labels properly associated
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG

## Performance

- [ ] Page load times acceptable
- [ ] API response times under 1s
- [ ] Images optimized (if any)
- [ ] No console errors in production
- [ ] MongoDB indexes created

## Security

- [ ] All API routes require authentication
- [ ] Admin-only operations protected
- [ ] User data not exposed in client
- [ ] Environment variables secured
- [ ] CORS configured properly

## Edge Cases

- [ ] Empty database state
- [ ] Single product/warehouse
- [ ] Very long product names
- [ ] Special characters in inputs
- [ ] Concurrent stock updates
- [ ] Deleting warehouse with locations
- [ ] Receipt with zero products

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] MongoDB Atlas configured
- [ ] Clerk production keys configured
- [ ] Build succeeds without errors
- [ ] Production errors logged
- [ ] Database backups configured

---

## Test Results Summary

**Date Tested:** _________________

**Tested By:** _________________

**Pass Rate:** _____ / _____ tests passed

**Critical Issues Found:**
1. 
2. 
3. 

**Minor Issues Found:**
1. 
2. 
3. 

**Notes:**
