# Hukie - Safe Dating App

A React-based mobile application built with Capacitor for Android and iOS deployment.

## Project Overview

Hukie is a location-based dating application focused on safety and meaningful connections. The app features a map-based interface to discover potential matches nearby, chat functionality, and profile management.

## Features

- **Interactive Map**: Discover users nearby with an interactive map interface
- **User Profiles**: Detailed user profiles with images, bio, and preferences
- **Chat System**: Real-time messaging with connected users
- **Video Calls**: Connect with matches through video calls
- **Onboarding Flow**: Smooth onboarding experience for new users
- **Authentication**: Secure login and signup functionality

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Mobile Framework**: Capacitor
- **Maps**: Mapbox GL
- **UI Components**: Custom components with Lucide React icons
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Java JDK 17 (for Android builds)
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd hukie-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Building for Android

Please refer to the [APK Build Guidelines](APK_BUILD_GUIDELINES.md) for detailed instructions on building the Android APK.

### Building for iOS

1. Build the web assets:
   ```
   npm run build
   ```

2. Add iOS platform:
   ```
   npx cap add ios
   ```

3. Sync the web assets:
   ```
   npx cap sync ios
   ```

4. Open the project in Xcode:
   ```
   npx cap open ios
   ```

## Project Structure

- `/src` - React application source code
- `/public` - Static assets
- `/android` - Android platform files
- `/ios` - iOS platform files (after adding the platform)
- `/dist` - Build output directory

## Additional Documentation

- [APK Build Guidelines](APK_BUILD_GUIDELINES.md) - Instructions for building Android APKs
- [E-commerce Implementation Guide](READMESHOP.md) - Guide for the e-commerce features

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact the development team.
