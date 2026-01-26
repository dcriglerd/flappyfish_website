# Flappy Fish Website - Deployment Guide

## 📁 Website Files Location
All website files are in: `/app/flappy-fish746com/website/`

```
website/
├── index.html          # Main landing page
├── privacy-policy.html # Privacy policy page
├── ads.txt             # Google AdMob verification
└── images/             # Screenshots and assets (need to add)
```

## 🖼️ Images You Need to Add

Create an `images` folder and add these files:

| File Name | Description | Download From |
|-----------|-------------|---------------|
| `screenshot-gameplay.png` | Gameplay screenshot | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/f175f09aa0daf42da6d482ef97ee6f2ae62f941a8a9dafaab34332892abfe40c.png) |
| `screenshot-menu.png` | Main menu screenshot | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/0d0acbf18dba83fefb99318def9fac83a227c4bcd4d92598d2fe6bf4cab6aea4.png) |
| `screenshot-skins.png` | Fish skins screenshot | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/0332e246a81450504a13bafc26b33358b49f2681d380a5ac8f0ab57076c10080.png) |
| `screenshot-leaderboard.png` | Leaderboard screenshot | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/e20d09b4b97c7f34acb9c2a8792be98c991c7c20b83f7fa6004ae1a8de23994b.png) |
| `screenshot-achievements.png` | Achievements screenshot | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/25dc261c40ed0fa9c9090d5650d1a29dc3a9e86b2869349adac8985e029ce8b8.png) |
| `favicon.png` | Browser tab icon (use app icon) | [Link](https://static.prod-images.emergentagent.com/jobs/22c7dd22-6380-4223-86fb-ef50f7f18339/images/d591db085b4770746e2870c0b309d611d3d76a348df7cc4609acc17e74f46a67.png) |
| `og-image.png` | Social media share image | Use feature graphic |

## 🚀 Deployment Options

### Option 1: Upload via FTP/cPanel (Most Common)
1. Log into your hosting provider's cPanel
2. Open File Manager
3. Navigate to `public_html` folder
4. Upload all files from the `website/` folder
5. Make sure `index.html` is in the root

### Option 2: Cloudflare Pages (Free)
1. Go to https://pages.cloudflare.com
2. Connect your GitHub repo or upload directly
3. Set build output to the website folder
4. Deploy

### Option 3: Netlify (Free)
1. Go to https://netlify.com
2. Drag and drop the website folder
3. Connect your domain

### Option 4: Vercel (Free)
1. Go to https://vercel.com
2. Import and deploy

## 🔗 After Deployment

1. **Test the site:** Visit https://flappyfish746.com
2. **Test privacy policy:** Visit https://flappyfish746.com/privacy-policy.html
3. **Test ads.txt:** Visit https://flappyfish746.com/ads.txt
4. **Update Play Store:** Add your website URL to the Play Store listing

## 📝 Update Play Store Listing

Once the website is live, update your Google Play Console:
1. Go to Store presence → Main store listing
2. Add website URL: https://flappyfish746.com
3. Update Privacy policy URL: https://flappyfish746.com/privacy-policy.html

## ✅ Checklist

- [ ] Upload all website files
- [ ] Add images to images/ folder
- [ ] Test all pages load correctly
- [ ] Verify ads.txt is accessible
- [ ] Update Play Store with website URL
- [ ] Update Play Store privacy policy URL
