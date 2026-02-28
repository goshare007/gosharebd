# GoShareBD - Feature Roadmap

## High Priority

### 1. Payment Integration
- **Why**: Bookings are recorded but no payment collection
- **Implementation**:
  - Stripe or SSL Commerce integration
  - Payment status tracking
  - Payment history

### 2. Email Notifications
- **Why**: No confirmation sent to users
- **Implementation**:
  - Booking confirmation email
  - Admin notification email
  - Status change notifications
  - Use Resend or SendGrid

---

## Medium Priority

### 3. Wishlist/Favorites
- **Why**: Link exists at /wishlist but page doesn't exist
- **Implementation**:
  - Create Wishlist model in Prisma
  - Add to wishlist button on package cards
  - Wishlist page

### 4. My Reviews Page
- **Why**: Link exists at /my-reviews but page doesn't exist
- **Implementation**:
  - Review schema exists in Prisma
  - User's submitted reviews page
  - Add reviews to packages

### 5. Search Functionality
- **Why**: Users need to find specific destinations/packages
- **Implementation**:
  - Global search in header
  - Search by destination, package name, tags

### 6. Contact Form Backend
- **Why**: UI exists but form just logs to console (see contact/page.tsx:151)
- **Implementation**:
  - API endpoint to save inquiries
  - Admin notification
  - Database table for inquiries

### 7. Admin Package Management
- **Why**: Page exists at /dashboard/admin/packages but is empty
- **Implementation**:
  - List all packages with CRUD operations
  - Use existing API endpoints

### 8. Admin Users Management
- **Why**: Page exists at /dashboard/admin/users but is empty
- **Implementation**:
  - List all users
  - User actions (ban/unban, role change)

---

## Nice to Have

### 9. Blog Admin Panel
- **Why**: Blog is currently hardcoded
- **Implementation**:
  - CMS for creating/editing posts
  - Rich text editor
  - Featured images

### 10. WhatsApp Integration
- **Why**: Popular in Bangladesh for customer communication
- **Implementation**:
  - WhatsApp floating button
  - Booking inquiry via WhatsApp

---

## Completed ✅

1. **Admin Dashboard** - Full stats, charts, popular packages, recent bookings
2. **User Dashboard** - Full stats, upcoming trips, booking history
3. **Admin Dashboard Stats API** - Fully implemented
4. **My Bookings Page** - Fully implemented with filtering, pagination, details dialog
5. **Booking System** - Add, list, update status, delete
6. **Destinations Management** - Full CRUD
7. **Packages Management** - Basic CRUD
8. **Gallery Management** - Full CRUD
9. **Static Pages** - About, Contact, FAQ, Help, Privacy, Terms, etc.
10. **User Authentication** - Login with Better Auth
11. **Newsletter Subscription** - Full backend with subscribe/unsubscribe, source tracking
12. **Departure Management** - Per-package departures with capacity tracking, guaranteed flag, pricing overrides

---

## Quick Wins (Do First)

1. Contact Form Backend
2. Wishlist Feature
3. My Reviews Page
4. Search Functionality
