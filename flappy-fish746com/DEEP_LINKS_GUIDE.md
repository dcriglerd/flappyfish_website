# Deep Links Setup Guide for Flappy Fish

## Overview
Deep links allow users to open your app directly from links on flappyfish746.com.

**Example links that will open the app:**
- `https://flappyfish746.com` → Opens app
- `https://flappyfish746.com/play` → Opens app
- `flappyfish://game` → Opens app directly

---

## Step 1: Upload App to Play Store (Required First)

You need to upload the AAB to Google Play Console first to get the SHA-256 fingerprint.

1. Go to https://play.google.com/console
2. Create your app (if not done already)
3. Go to **Production** → **Create new release**
4. Upload the AAB: https://expo.dev/artifacts/eas/cKhKRk42vuxpnyZZkwVg4u.aab
5. Complete the store listing and submit

---

## Step 2: Get SHA-256 Fingerprint

After uploading to Play Store:

1. Go to **Setup** → **App signing** (or **Release** → **App integrity** → **App signing**)
2. Find **"App signing key certificate"**
3. Copy the **SHA-256 certificate fingerprint**
   - Looks like: `FA:C6:17:45:DC:09:03:78:6F:B9:ED:...`

---

## Step 3: Update assetlinks.json

Edit the file at: `website/.well-known/assetlinks.json`

Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual SHA-256:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.flappyfish.game",
      "sha256_cert_fingerprints": [
        "FA:C6:17:45:DC:09:03:78:6F:B9:ED:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX"
      ]
    }
  }
]
```

---

## Step 4: Deploy Website to Cloudflare

Upload these files to your website:

```
website/
├── index.html
├── privacy-policy.html
├── ads.txt
├── images/
│   └── (all screenshots)
└── .well-known/
    └── assetlinks.json    ← IMPORTANT: This must be accessible
```

**Verify it's working:**
Visit: `https://flappyfish746.com/.well-known/assetlinks.json`
- Should show the JSON content
- Must return `Content-Type: application/json`

---

## Step 5: Build New APK with Deep Links

After updating assetlinks.json and deploying website, build a new APK:

```bash
npx eas build --platform android --profile preview
```

---

## Step 6: Test Deep Links

1. Install the new APK on your Android device
2. Open Chrome and go to: `https://flappyfish746.com`
3. If app is installed, Android should offer to open it in the app
4. Or tap any link to flappyfish746.com from another app

---

## Troubleshooting

### Links not opening app?

1. **Check assetlinks.json is accessible:**
   ```
   curl https://flappyfish746.com/.well-known/assetlinks.json
   ```

2. **Verify SHA-256 is correct:**
   - Must match exactly (including colons)
   - Use the **App signing key** (not upload key)

3. **Clear app defaults:**
   - Settings → Apps → Flappy Fish → Open by default → Clear defaults

4. **Use Google's verification tool:**
   https://developers.google.com/digital-asset-links/tools/generator
   - Enter your domain and package name
   - It will tell you if setup is correct

---

## Quick Reference

| Item | Value |
|------|-------|
| Package Name | `com.flappyfish.game` |
| Domain | `flappyfish746.com` |
| assetlinks.json URL | `https://flappyfish746.com/.well-known/assetlinks.json` |
| Custom URL Scheme | `flappyfish://game` |
