# Heritage 360 Buzz - Deployment Guide 🚀

This guide will help you deploy the Heritage 360 Buzz System to the cloud with a permanent URL that won't change during updates.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)
- Git installed on your machine

## 🎯 Deployment Strategy

We'll deploy the system in two parts:
- **Backend API**: Deployed to Vercel Functions
- **Frontend Dashboard**: Deployed to Vercel Static Hosting

**Permanent URL**: `https://heritage360buzz.vercel.app` (won't change with updates)

## 🔧 Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with username/password
4. Whitelist all IP addresses (0.0.0.0/0) for demo purposes
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/heritage360buzz?retryWrites=true&w=majority`

## 🐙 Step 2: Push to GitHub

1. **Install Git** (if not already installed):
   - Download from https://git-scm.com/download/windows
   - Follow installation instructions

2. **Initialize and push to GitHub**:
   ```bash
   # Navigate to project directory
   cd Heritage360Buzz
   
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Initial commit
   git commit -m "Initial commit: Heritage 360 Buzz System"
   
   # Create GitHub repository (go to github.com/new)
   # Name it: heritage-360-buzz
   
   # Add remote origin (replace YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/heritage-360-buzz.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

## ☁️ Step 3: Deploy to Vercel

1. **Create Vercel Account**:
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import your `heritage-360-buzz` repository
   - Select "Other" as framework preset

3. **Configure Build Settings**:
   - Root Directory: `./`
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install && cd client && npm install`

4. **Set Environment Variables**:
   In Vercel dashboard → Settings → Environment Variables:
   
   ```bash
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=heritage360buzz_super_secret_production_key_2024
   JWT_EXPIRE=30d
   HOTEL_CURRENCY=USD
   RESTAURANT_CURRENCY=GHS
   PUB_CURRENCY=GHS
   BUSINESS_NAME=Heritage 360 Buzz
   DOUBLE_ROOM_RATE=40
   EXECUTIVE_ROOM_RATE=60
   MASTER_ROOM_RATE=120
   VAT_RATE=0.125
   SERVICE_CHARGE_RATE=0.10
   FRONTEND_URL=https://heritage360buzz.vercel.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at: `https://heritage360buzz.vercel.app`

## 🎨 Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `heritage360buzz.com`)
3. Follow DNS configuration instructions
4. SSL certificate will be auto-generated

## 🔄 Step 5: Set Up Auto-Deployment

The GitHub Actions workflow is already configured! Every time you push to the main branch:
- Code is automatically tested
- Frontend is built
- System is deployed to production
- **URL remains the same**: `https://heritage360buzz.vercel.app`

## 🌱 Step 6: Seed Production Database

After deployment, access your live app and run the seeder:

1. Go to: `https://heritage360buzz.vercel.app/api/health`
2. If healthy, the API is working
3. The database will be automatically seeded on first run

## 🔐 Default Production Credentials

Once deployed, you can login with:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | admin | admin123 |
| **Hotel Manager** | hotelmanager | hotel123 |
| **Restaurant Manager** | restmanager | restaurant123 |
| **Waiter** | waiter1 | waiter123 |
| **Receptionist** | receptionist1 | reception123 |
| **Accountant** | accountant1 | accounting123 |

## 📱 Mobile Responsiveness

The dashboard is fully mobile responsive with:
- ✅ Touch-friendly interface
- ✅ Mobile navigation menu
- ✅ Responsive cards and layouts
- ✅ Swipe gestures support
- ✅ Mobile-optimized forms

## 🎨 Theme Customization

Users can customize dashboard colors with 7 built-in themes:
- Heritage Gold (Default)
- Ocean Blue
- Forest Green
- Sunset Orange
- Royal Purple
- Midnight Dark
- Rose Garden

## 🔄 Continuous Deployment

Your permanent URL will **NEVER change**, even with updates:
- **Production URL**: `https://heritage360buzz.vercel.app`
- All updates deploy automatically
- Zero downtime deployments
- Rollback capability if needed

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (use 18.x or 20.x)
   - Ensure all dependencies are installed
   - Check environment variables

2. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check network access settings (whitelist IPs)
   - Ensure database user has proper permissions

3. **API Not Working**:
   - Check Vercel function logs
   - Verify environment variables are set
   - Test `/api/health` endpoint

### Debug Commands:

```bash
# Test locally
npm run dev

# Build frontend
cd client && npm run build

# Test API
curl https://heritage360buzz.vercel.app/api/health
```

## 📈 Performance Monitoring

Vercel provides built-in analytics:
- Page load times
- API response times
- Error tracking
- Usage statistics

## 🔒 Security Features

✅ **JWT Authentication**
✅ **Password Encryption**
✅ **Rate Limiting**
✅ **CORS Protection**
✅ **Role-Based Access**
✅ **Input Validation**
✅ **SQL Injection Prevention**

## 🌟 Next Steps

After deployment, consider:
1. Setting up monitoring alerts
2. Configuring email notifications
3. Adding payment gateway integration
4. Setting up backup strategies
5. Implementing advanced analytics

## 🎉 Success!

Your Heritage 360 Buzz System is now live at:
**🔗 https://heritage360buzz.vercel.app**

This URL will remain permanent and won't change with future updates. The system features:
- ✨ Professional dashboard with WOW factor
- 🎨 7 customizable color themes
- 📱 Mobile-responsive design
- 🔒 Secure authentication system
- 💰 Multi-currency support (USD/GHS)
- 🏨 Complete hospitality management

---

**Support**: For any deployment issues, check the logs in Vercel dashboard or contact the development team.