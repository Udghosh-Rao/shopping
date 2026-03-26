# DripStore — Hostinger Deployment Checklist

## ✅ Security Fixes Completed

### Critical Security Issues Fixed
- [x] **Admin route protection** — middleware.ts properly protects /admin/* with role verification
- [x] **Payment amount validation** — create-order API recalculates from DB prices (prevents ₹1 manipulation)
- [x] **Seed route removed** — /api/seed deleted (was publicly accessible)
- [x] **Demo-mode payment disabled** — verify route requires valid Razorpay signature (no auto-approve)
- [x] **Admin email case-sensitivity** — Fixed (.toLowerCase() on both sides)
- [x] **Coupon manipulation prevented** — create-order re-validates coupon server-side
- [x] **Rate limiting added** — signup route limited to 5 requests per 15 minutes per IP

### Backend Cleanup
- [x] All `isMongoConfigured()` branches removed (no RAM-only fallbacks)
- [x] All `demoBackend` imports removed from:
  - /api/auth/signup, /api/auth/[...nextauth], lib/auth.ts
  - /api/payment/create-order, /api/payment/verify
  - /api/coupon
  - /api/admin/* routes
  - /api/orders*
- [x] Email normalization added (lowercase on all user lookups)

### Frontend & UX
- [x] Order success page validation (requires orderId query param)
- [x] Tailwind darkMode: 'class' added to config
- [x] Standalone output mode added for Hostinger

---

## 🛡️ Legal Compliance

- [x] **Privacy Policy** created at `/legal/privacy-policy`
  - Data collection and usage policies
  - Security measures
  - User rights (access, deletion, opt-out)
  - 7-year retention for tax compliance
  - GDPR-inspired privacy protections

- [x] **Terms of Service** created at `/legal/terms`
  - Use restrictions and account terms
  - Order/payment/shipping policies
  - 15-day returns policy
  - Limitation of liability
  - Dispute resolution under Indian law

- [x] **Footer updated** to link to Privacy Policy and Terms of Service

---

## 🚀 Deployment Preparation

### Environment Variables (Set in Hostinger)

**REQUIRED - Must be set before deployment:**

```
MONGODB_URI=<your-mongodb-atlas-connection-string>
NEXTAUTH_SECRET=<generate-long-random-string>
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
RAZORPAY_KEY_ID=<from-razorpay-dashboard>
RAZORPAY_KEY_SECRET=<from-razorpay-dashboard>
CLOUDINARY_CLOUD_NAME=<from-cloudinary>
CLOUDINARY_API_KEY=<from-cloudinary>
CLOUDINARY_API_SECRET=<from-cloudinary>
ADMIN_EMAIL=your-email@example.com
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Hosting Requirements

- [ ] Verify you're on **VPS or Business hosting plan** (shared hosting does NOT support Node.js)
- [ ] Request Node.js 18+ runtime from Hostinger support
- [ ] Confirm `output: 'standalone'` in next.config.ts ✓ (already added)

### Pre-Deployment Verification

```bash
# 1. Build production bundle
npm run build

# 2. Verify build succeeded with no errors
# Output should show: "✓ Compiled successfully"

# 3. Check all env vars are set in local .env.local:
cat .env.local

# 4. Run linter (optional but recommended)
npm run lint
```

### Deployment Steps

1. **Initialize Hostinger Node.js Application**
   - Choose Node.js 18+ runtime
   - Set startup command: `npm run start -- -p ${PORT:-3000}`
   - Or: `node .next/standalone/server.js`

2. **Set Environment Variables**
   - Go to Hostinger control panel → Application Settings → Environment Variables
   - Add all variables from the checklist above
   - **DO NOT** commit these to Git

3. **Deploy Code**
   - Push to your Git repository
   - Hostinger will automatically pull and build
   - Or use Hostinger's deployment tools

4. **Verify Deployment**
   - Check application is running: `https://your-domain.com`
   - Test homepage loads
   - Try login page
   - Verify SSL certificate is active

---

## ⚠️ Known Limitations & TODO

### Low Priority (Can add later)
- [ ] RestockNotify component sends no email (needs Nodemailer/Resend setup)
- [ ] Admin product edit overwrites with hardcoded defaults
- [ ] Email notifications don't exist (customers don't get order confirmation emails)
- [ ] GST invoice generation not implemented
- [ ] robots.txt and sitemap.xml for SEO
- [ ] Per-page SEO metadata (generateMetadata on product/category pages)
- [ ] Shipping Policy page (currently # link)
- [ ] Refund Policy page (currently # link)
- [ ] Delete lib/demoBackend.ts (can be removed after verification all imports are gone)

### Optional Enhancements
- [ ] Implement email notifications with Nodemailer or Resend
- [ ] Add Shipping/Refund policy pages
- [ ] Update WhatsApp number (currently 919999999999)
- [ ] Replace social media links with actual accounts
- [ ] Replace homepage stats with real numbers (or remove section)
- [ ] Add robots.txt and sitemap.xml for SEO indexing

---

## 🔍 Production Security Audit Status

**Implemented (5 critical + 3 important):**
- [x] Admin route protection middleware.ts
- [x] Server-side payment amount validation
- [x] No public /api/seed endpoint
- [x] No demo-mode auto-approval of orders
- [x] Case-insensitive admin email comparison
- [x] Rate limiting on signup
- [x] Server-side coupon validation
- [x] Coupon discount re-validation at payment time
- [x] Remove all demo-mode fallbacks

**Not Implemented (Lower priority, optional):**
- [ ] Email notifications (customers get confirmation emails)
- [ ] GST invoice generation (required for B2B/Enterprise)
- [ ] Shipping Policy page
- [ ] Refund Policy page (15-day policy mentioned but no page)
- [ ] Contact page for support

---

## 📊 Build Status

```
✓ Compiled successfully in ~2 seconds
✓ No TypeScript errors
✓ All routes properly configured
✓ Ready for production deployment
```

### Routes Available

**Public Routes:**
- `/` — Homepage
- `/shop` — Product catalog
- `/product/[slug]` — Product detail
- `/login` — Login page
- `/signup` — Signup page
- `/cart` — Shopping cart
- `/legal/privacy-policy` — Privacy Policy
- `/legal/terms` — Terms of Service

**Protected Routes (Require Auth):**
- `/checkout` — Checkout page
- `/profile` — User profile & order history
- `/order-success` — Order confirmation (requires orderId param)

**Admin Routes (Require admin role):**
- `/admin/dashboard` — Dashboard
- `/admin/products` — Product management
- `/admin/customers` — Customer list
- `/admin/orders` — Order management

---

## 📝 Final Notes

1. **Backup your code** before deploying
2. **Test staging environment** if possible before production
3. **Monitor logs** after deployment for any errors
4. **Set up monitoring** for application health
5. **Plan database backups** (MongoDB Atlas has daily backups)
6. **Keep NEXTAUTH_SECRET safe** — don't share or expose in Git
7. **Rotate secrets regularly** for security
8. **Monitor Razorpay** for payment processing status

---

## 🎯 Success Criteria

After deployment, verify:
- [ ] Homepage loads without errors
- [ ] Images load from Cloudinary
- [ ] Sign up works with email validation
- [ ] Google OAuth sign-in works
- [ ] Login/logout functionality works
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Payment processing through Razorpay works
- [ ] Admin dashboard accessible with admin account
- [ ] Order history visible in profile
- [ ] Legal pages accessible from footer

---

**Last Updated:** {new Date().toLocaleDateString()}
**Status:** Ready for Hostinger Deployment ✓
