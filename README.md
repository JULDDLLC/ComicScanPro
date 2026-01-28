# ComicScan Pro

A powerful AI-powered comic book scanner app for iOS and Android. Perfect for collectors, dealers, and anyone who loves comics!

## Features

### 📸 Core Scanning
- **AI Comic Recognition** - Snap a photo and instantly identify the comic
- **Condition Grading** - Automatic condition analysis (Gem Mint to Poor)
- **Live Pricing** - Real-time market values from PriceCharting & GoCollect
- **Complete Details** - Writers, artists, publishers, publication dates, and more
- **Fun Facts** - Interesting trivia, first appearances, and key events

### 💰 Dealer Mode
- **Bulk Scanning** - Scan multiple comics rapidly
- **Inventory Management** - Track location, cost, and current value
- **Profit/Loss Dashboard** - Monitor your investment performance
- **Quick Listings** - Generate seller-ready listings for eBay, Mercari, Facebook
- **Sales Analytics** - Track what's selling and what's sitting
- **Price Alerts** - Get notified when prices spike

### 📚 Collector Mode
- **Collection Tracking** - Build and manage your collection
- **Want List** - Track comics you're looking for
- **Collection Stats** - View your collection by publisher, condition, and value
- **Insurance Reports** - Generate PDF reports for insurance purposes
- **Price Tracking** - Monitor values over time

### 🎯 Advanced Features
- **Variant Detection** - Identify rare variant covers
- **CGC/CBCS Submission Tracker** - Track grading submissions and ROI
- **Price History** - See how values have changed
- **Offline Mode** - Works at conventions without internet
- **Cloud Backup** - Secure backup of your collection

## Installation

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Setup

1. **Clone or download the project**
```bash
cd ComicScanPro
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Keys**

Create a `.env` file in the root directory:
```
GOOGLE_CLOUD_VISION_API_KEY=your_key_here
COMIC_VINE_API_KEY=your_key_here
PRICECHARTING_API_KEY=your_key_here
```

Get your API keys:
- **Google Cloud Vision**: https://cloud.google.com/vision/docs/setup
- **Comic Vine**: https://comicvine.gamespot.com/api/
- **PriceCharting**: https://www.pricecharting.com/api

4. **Start the app**

For development:
```bash
npm start
```

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Project Structure

```
ComicScanPro/
├── App.tsx                 # Main app entry point with navigation
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── DealerDashboard.tsx
│   │   ├── ListingScreen.tsx
│   │   ├── WantListScreen.tsx
│   │   ├── CollectionStatsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # API services
│   │   ├── visionApi.ts
│   │   ├── metronApi.ts
│   │   ├── pricingApi.ts
│   │   └── listingGenerator.ts
│   ├── components/        # Reusable components
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants and theme
│   ├── types/            # TypeScript types
│   └── hooks/            # Custom React hooks
├── package.json
└── README.md
```

## Usage

### For Collectors
1. **Launch the app** and select "Collector" mode
2. **Scan a comic** by taking a photo or selecting from gallery
3. **Review the details** - condition, pricing, creators, fun facts
4. **Add to collection** to track your comics
5. **Manage want list** to track comics you're looking for
6. **View collection stats** to see your collection overview

### For Dealers
1. **Launch the app** and select "Dealer" mode
2. **Quick scan** individual comics or **bulk scan** multiple items
3. **Set pricing** based on market data or your own prices
4. **Generate listings** ready to post on eBay, Mercari, etc.
5. **Track inventory** by location and monitor profit/loss
6. **View analytics** to see what's selling

## API Integration

### Metron API
Provides comprehensive comic metadata including:
- Title, issue number, volume
- Publisher and publication date
- Writers, artists, colorists, letterers
- First appearances and key events
- Variant information

### PriceCharting API
Real-time pricing data:
- Current market values
- Historical price trends
- Prices by condition grade
- Multiple marketplace data

### Google Cloud Vision API
AI-powered image recognition:
- Comic cover identification
- Text extraction
- Condition analysis

## Data Storage

The app uses AsyncStorage for local data persistence:
- **collection** - Your comic collection
- **wantList** - Comics you're looking for
- **recentScans** - Recently scanned comics
- **dealerInventory** - Dealer inventory items
- **appSettings** - User preferences

## Customization

### Theme Colors
Edit `src/constants/theme.ts` to customize colors:
```typescript
export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  // ... more colors
};
```

### API Endpoints
Modify API services in `src/services/` to use different data sources

## Building for Production

### Android APK
```bash
eas build --platform android
```

### iOS IPA
```bash
eas build --platform ios
```

## Troubleshooting

### Camera Permission Issues
- iOS: Add camera permission to Info.plist
- Android: Grant camera permission in app settings

### API Key Errors
- Verify API keys are correctly set in `.env`
- Check API quotas and rate limits
- Ensure APIs are enabled in respective consoles

### Image Recognition Not Working
- Ensure image is clear and well-lit
- Try manual search as fallback
- Check Google Cloud Vision API quota

## Future Enhancements

- [ ] Barcode scanning support
- [ ] Social features (follow collectors, trade lists)
- [ ] Advanced filtering and search
- [ ] Mobile app store deployment
- [ ] Web dashboard
- [ ] Integration with CGC/CBCS grading services
- [ ] Automated price monitoring
- [ ] Multi-user support

## Support

For issues, questions, or feature requests, please contact support or open an issue.

## License

This project is proprietary software. All rights reserved.

## Credits

Built for comic collectors and dealers everywhere. Special thanks to:
- Metron for comic metadata
- PriceCharting for pricing data
- Google Cloud Vision for AI recognition

---

**ComicScan Pro v1.0.0** - Made for the comic community ❤️
