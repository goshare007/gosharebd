# GoShareBD - Feature Roadmap

## High Priority

### 2. My Bookings Page
- **Why**: Link exists at /my-bookings but page doesn't exist
- **Implementation**:
  - User's booking list with status
  - Booking details view
  - Ability to cancel pending bookings (API exists in booking service)

### 3. Payment Integration
- **Why**: Bookings are recorded but no payment collection
- **Implementation**:
  - Stripe or SSL Commerce integration
  - Payment status tracking
  - Payment history

### 4. Email Notifications
- **Why**: No confirmation sent to users
- **Implementation**:
  - Booking confirmation email
  - Admin notification email
  - Status change notifications
  - Use Resend or SendGrid

---

## Medium Priority

### 5. Wishlist/Favorites
- **Why**: Link exists at /wishlist but page doesn't exist
- **Implementation**:
  - Create Wishlist model in Prisma
  - Add to wishlist button on package cards
  - Wishlist page

### 6. My Reviews Page
- **Why**: Link exists at /my-reviews but page doesn't exist
- **Implementation**:
  - Review schema exists in Prisma
  - User's submitted reviews page
  - Add reviews to packages

### 7. Search Functionality
- **Why**: Users need to find specific destinations/packages
- **Implementation**:
  - Global search in header
  - Search by destination, package name, tags

### 8. Contact Form Backend
- **Why**: Contact page UI exists but form doesn't work
- **Implementation**:
  - API endpoint to save inquiries
  - Admin notification
  - Database table for inquiries

### 9. Blog Admin Panel
- **Why**: Blog is currently hardcoded
- **Implementation**:
  - CMS for creating/editing posts
  - Rich text editor
  - Featured images

### 10. Admin Pages (Links Exist)
- **Why**: Navigation links exist but pages don't
- **Implementation**:
  - /admin/tours - Manage all tours/packages
  - /admin/users - User management
  - /admin/analytics - Visitor insights

---

## Nice to Have

### 11. Newsletter Subscription
- **Why**: Newsletter signup UI exists but no backend
- **Implementation**:
  - Email collection API
  - Integration with email service

### 12. WhatsApp Integration
- **Why**: Popular in Bangladesh for customer communication
- **Implementation**:
  - WhatsApp floating button
  - Booking inquiry via WhatsApp

### 13. Multi-language Support
- **Why**: Reach Bengali-speaking audience
- **Implementation**:
  - i18n setup
  - Bengali translations for key pages

### 14. Settings & Support Pages
- **Why**: Links exist but pages don't
- **Implementation**:
  - /account/settings - Account settings
  - /notifications - Notification center
  - /support - Customer support

---

## Quick Wins (Do First)

1. Admin Dashboard UI (API already done!)
2. My Bookings Page
3. Wishlist Feature
4. My Reviews Page
5. Contact Form Backend
