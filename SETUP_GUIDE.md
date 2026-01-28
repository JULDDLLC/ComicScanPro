# ComicScan Pro - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd ComicScanPro
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Emulator
- **Android**: Press `a` in terminal
- **iOS**: Press `i` in terminal
- **Web**: Press `w` in terminal

## Full Setup with API Keys (15 minutes)

### Step 1: Get API Keys

#### Google Cloud Vision API
1. Go to https://cloud.google.com/vision/docs/setup
2. Create a new project
3. Enable Vision API
4. Create a service account
5. Download JSON key file
6. Copy the API key

#### Comic Vine API
1. Visit https://comicvine.gamespot.com/api/
2. Register for an account
3. Generate API key from your profile

#### PriceCharting API
1. Go to https://www.pricecharting.com/api
2. Request API access
3. Get your API key

### Step 2: Configure Environment

Create `.env` file in project root:
```
GOOGLE_CLOUD_VISION_API_KEY=your_google_key
COMIC_VINE_API_KEY=your_comic_vine_key
PRICECHARTING_API_KEY=your_pricecharting_key
```

### Step 3: Update API Services

Edit `src/services/visionApi.ts`:
```typescript
const response = await fetch(
  `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_VISION_API_KEY}`,
  // ...
);
```

Edit `src/services/metronApi.ts`:
```typescript
// Metron API is free and doesn't require a key
// Just use the base URL as-is
```

Edit `src/services/pricingApi.ts`:
```typescript
// Add your PriceCharting API key
const PRICECHARTING_API_KEY = process.env.PRICECHARTING_API_KEY;
```

### Step 4: Test the App

1. **Test Camera**
   - Navigate to Scanner screen
   - Grant camera permission
   - Take a test photo

2. **Test API Integration**
   - Scan a comic or search manually
   - Verify data loads correctly
   - Check pricing information

3. **Test Local Storage**
   - Add comic to collection
   - Restart app
   - Verify data persists

## Building for Production

### Android Build

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Build APK**
```bash
eas build --platform android --local
```

4. **Install on Device**
```bash
adb install path/to/app.apk
```

### iOS Build

1. **Build IPA**
```bash
eas build --platform ios --local
```

2. **Install on Device**
   - Use Xcode or TestFlight
   - Or use `ios-deploy` command

## Customization Guide

### Change App Colors

Edit `src/constants/theme.ts`:
```typescript
export const COLORS = {
  primary: '#2563EB',        // Main brand color
  primaryDark: '#1E40AF',    // Darker shade
  secondary: '#10B981',      // Accent color
  background: '#F9FAFB',     // App background
  card: '#FFFFFF',           // Card background
  text: '#1F2937',           // Text color
  textSecondary: '#6B7280',  // Secondary text
  border: '#E5E7EB',         // Border color
};
```

### Change App Name

1. Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

2. Edit `App.tsx` header text

### Add New Screen

1. Create new file in `src/screens/`
2. Add to navigation in `App.tsx`
3. Add route type to `RootStackParamList`

## Troubleshooting

### "Module not found" Error
```bash
npm install
npm start --clear
```

### Camera Permission Denied
- **iOS**: Check Info.plist for camera permission
- **Android**: Grant permission in app settings

### API Errors
1. Verify API keys are correct
2. Check API quotas
3. Ensure APIs are enabled
4. Check network connection

### Image Recognition Not Working
1. Ensure image is clear
2. Try manual search
3. Check Google Cloud Vision quota
4. Verify API key is valid

### Data Not Persisting
1. Check AsyncStorage is installed
2. Verify app has storage permission
3. Check device storage space
4. Clear app cache and try again

## Performance Optimization

### Image Optimization
- Compress images before sending to API
- Use appropriate image quality settings
- Cache results locally

### API Caching
- Cache comic data locally
- Implement request debouncing
- Use pagination for large lists

### Memory Management
- Clear old scan history
- Unload unused images
- Implement lazy loading

## Security Best Practices

1. **Never commit API keys**
   - Use `.env` file
   - Add `.env` to `.gitignore`

2. **Validate user input**
   - Sanitize search queries
   - Validate prices and numbers

3. **Secure data storage**
   - Use encrypted storage for sensitive data
   - Implement user authentication

4. **HTTPS only**
   - All API calls use HTTPS
   - Validate SSL certificates

## Testing

### Manual Testing Checklist
- [ ] Camera scanning works
- [ ] Manual search works
- [ ] Pricing data loads
- [ ] Condition grading displays
- [ ] Add to collection works
- [ ] Want list management works
- [ ] Dealer dashboard loads
- [ ] Listing generation works
- [ ] Settings save correctly
- [ ] Data persists after restart

### Test Data
Use these comics for testing:
- Amazing Spider-Man #1
- Action Comics #1
- Detective Comics #27
- X-Men #1
- Incredible Hulk #1

## Deployment Checklist

Before releasing to app stores:
- [ ] All API keys configured
- [ ] App icon created
- [ ] Splash screen designed
- [ ] Privacy policy written
- [ ] Terms of service created
- [ ] App tested on multiple devices
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Analytics integrated
- [ ] Crash reporting enabled

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Metron API**: https://metron.cloud/api
- **PriceCharting API**: https://www.pricecharting.com/api
- **Google Cloud Vision**: https://cloud.google.com/vision

## Next Steps

1. Configure API keys
2. Test on your device
3. Customize colors and branding
4. Add your own features
5. Build and deploy to app stores

Happy scanning! 📚
