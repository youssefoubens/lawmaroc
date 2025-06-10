# Moroccan Legal SaaS Platform

A comprehensive digital platform providing legal information, document generation, and consultation services tailored to Moroccan law with authentication, subscription tiers, and compliance features.

## Features

### 🔐 Authentication & User Management
- **Multi-method Authentication**: Email/password, Google OAuth, SMS verification
- **Role-based Access Control**: Citizens, Advocates, Admins
- **Advocate Verification**: Manual review of bar association IDs and licenses
- **Profile Management**: Multilingual support (Arabic, French, English)

### 💳 Subscription & Pricing
- **Tiered Plans**: Free, Citizen Pro, Advocate Basic, Advocate Pro
- **Moroccan Dirham (MAD) Support**: Local currency pricing
- **Stripe Integration**: Secure payment processing
- **Flexible Billing**: Monthly and yearly options with discounts

### ⚖️ Legal Services
- **Document Generation**: Legal templates and forms
- **Case Management**: For advocates and clients
- **Appointment Booking**: Video consultations and meetings
- **Legal Consultations**: AI-powered and human expert advice

### 🏛️ Moroccan Compliance
- **Data Localization**: Adherence to Moroccan data protection laws
- **Multilingual Interface**: Arabic, French, and English support
- **Legal Framework**: Aligned with Moroccan legal system
- **Audit Logging**: Comprehensive compliance tracking

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe with MAD currency support
- **Authentication**: Supabase Auth with OAuth and SMS
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Stripe account (for payments)
- Google OAuth credentials (optional)
- Twilio account (for SMS, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moroccan-legal-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase, Stripe, and other service credentials.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - Configure authentication providers (Google, SMS)
   - Set up Row Level Security policies

5. **Configure Stripe**
   - Set up webhook endpoint: `/api/stripe/webhook`
   - Configure MAD currency support
   - Test payment flows

6. **Run the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Core Tables
- **profiles**: Extended user information with roles
- **advocates**: Advocate-specific data and verification
- **subscription_plans**: Available pricing tiers
- **user_subscriptions**: Active user subscriptions
- **legal_cases**: Case management system
- **appointments**: Booking and scheduling
- **payments**: Payment tracking and invoicing
- **audit_logs**: Compliance and security logging

### Security Features
- Row Level Security (RLS) on all tables
- Role-based access policies
- Audit logging for sensitive operations
- Data encryption and secure storage

## User Roles & Permissions

### 👤 Citizen (Client)
- Access legal information
- Generate basic documents
- Book consultations with advocates
- Manage personal cases

### ⚖️ Advocate (Lawyer)
- Verified professional account
- Case management tools
- Client communication portal
- Advanced analytics and reporting
- Video consultation capabilities

### 👨‍💼 Admin
- User and advocate verification
- Platform management
- Analytics and reporting
- Content moderation

## Subscription Plans

### 🆓 Free Plan
- Basic legal information access
- 1 consultation per month
- 5 document downloads
- Community support

### 💼 Citizen Pro (100 MAD/month)
- Priority consultations (10/month)
- Document generation (50/month)
- Chat support
- Priority response times

### ⚖️ Advocate Basic (500 MAD/month)
- Case management tools
- Client portal access
- Calendar integration
- 100 consultations/month

### 👑 Advocate Pro (1000 MAD/month)
- Advanced analytics
- Video consultations
- Priority listing
- API access
- Unlimited consultations

## Moroccan Legal Compliance

### Data Protection
- GDPR-compliant data handling
- Local data residency options
- User consent management
- Right to data portability

### Legal Framework
- Aligned with Moroccan civil law
- Support for Arabic legal terminology
- Integration with local legal procedures
- Compliance with bar association requirements

### Advocate Verification
- Bar association ID verification
- License number validation
- Professional credential checks
- Manual admin approval process

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user

### Subscription Endpoints
- `GET /api/subscriptions/plans` - List available plans
- `POST /api/stripe/create-checkout` - Create payment session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Legal Services Endpoints
- `GET /api/documents` - List legal documents
- `POST /api/consultations` - Create consultation request
- `GET /api/advocates` - List verified advocates
- `POST /api/appointments` - Book appointment

## Deployment

### Environment Setup
1. Set up production Supabase project
2. Configure Stripe webhook endpoints
3. Set up domain and SSL certificates
4. Configure email and SMS providers

### Deployment Steps
1. Build the application: `npm run build`
2. Deploy to your preferred platform (Vercel, Netlify, etc.)
3. Set up environment variables in production
4. Configure custom domain and SSL
5. Test all integrations and payment flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@moroccanlegalhelp.com
- Documentation: [Link to docs]
- Community: [Link to community forum]

## Roadmap

### Phase 1 (Current)
- ✅ Basic authentication and user management
- ✅ Subscription system with Stripe
- ✅ Document generation and management
- ✅ Advocate verification system

### Phase 2 (Next)
- 🔄 Video consultation integration
- 🔄 Advanced case management
- 🔄 Mobile app development
- 🔄 API for third-party integrations

### Phase 3 (Future)
- 📋 AI-powered legal analysis
- 📋 Integration with Moroccan court systems
- 📋 Advanced analytics and reporting
- 📋 Multi-tenant architecture for law firms