# Hukie React - Android APK Build Guidelines

This document provides guidelines for building the Android APK for the Hukie React application. Following these guidelines will help avoid common build issues and ensure a smooth build process.

## Environment Requirements

### Java Development Kit (JDK)
- **Required Version**: JDK 17
- **Current Installation**: `C:\Program Files\Java\jdk-17.0.10`
- **Important**: Do not use JDK 21 as it causes compatibility issues with the current Gradle configuration

### Android SDK
- **Compile SDK Version**: 33
- **Target SDK Version**: 33
- **Min SDK Version**: 23
- **SDK Location**: Ensure your `local.properties` file points to the correct Android SDK location
  ```
  sdk.dir=C:\\Users\\[YourUsername]\\AppData\\Local\\Android\\Sdk
  ```

### Gradle
- **Gradle Version**: 8.11.1 (defined in `gradle-wrapper.properties`)
- **Android Gradle Plugin Version**: 7.3.1 (must be consistent across all build files)

## Project Configuration

### Java Version Consistency
Ensure all Java version references in the project are consistent:

1. In `android/app/build.gradle`:
   ```gradle
   compileOptions {
       sourceCompatibility JavaVersion.VERSION_17
       targetCompatibility JavaVersion.VERSION_17
   }
   ```

2. In `android/app/capacitor.build.gradle`:
   ```gradle
   compileOptions {
       sourceCompatibility JavaVersion.VERSION_17
       targetCompatibility JavaVersion.VERSION_17
   }
   ```

3. In `android/capacitor-cordova-android-plugins/build.gradle`:
   ```gradle
   compileOptions {
       sourceCompatibility JavaVersion.VERSION_17
       targetCompatibility JavaVersion.VERSION_17
   }
   ```

### Gradle Plugin Version Consistency
Ensure all Android Gradle Plugin versions are consistent:

1. In `android/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.android.tools.build:gradle:7.3.1'
       // other dependencies...
   }
   ```

2. In `android/capacitor-cordova-android-plugins/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.android.tools.build:gradle:7.3.1'
   }
   ```

## Build Process

### Building Debug APK
Use one of the following methods to build a debug APK:

1. **Using the provided batch file**:
   ```
   cd android
   .\build-apk.bat
   ```

2. **Using Gradle directly**:
   ```
   cd android
   set JAVA_HOME=C:\Program Files\Java\jdk-17.0.10
   .\gradlew.bat assembleDebug
   ```

3. **Using PowerShell**:
   ```powershell
   cd android
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.10"
   .\gradlew.bat assembleDebug
   ```

The debug APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Building Release APK
To build a release APK, you need to:

1. Create a keystore file for signing the APK
2. Configure the signing configuration in `android/app/build.gradle`
3. Run the release build command:
   ```
   cd android
   set JAVA_HOME=C:\Program Files\Java\jdk-17.0.10
   .\gradlew.bat assembleRelease
   ```

## Common Issues and Solutions

### Java Version Mismatch
**Issue**: Build fails with errors related to Java version compatibility.

**Solution**:
1. Check all `compileOptions` blocks in Gradle files and ensure they use `JavaVersion.VERSION_17`
2. Ensure your `JAVA_HOME` environment variable points to JDK 17
3. Do not use JDK 21 as it's not compatible with the current configuration

### Android Gradle Plugin Version Mismatch
**Issue**: Build fails with errors related to Gradle plugin compatibility.

**Solution**:
1. Ensure all references to `com.android.tools.build:gradle` use the same version (7.3.1)
2. If you update the Gradle wrapper version, make sure it's compatible with the Android Gradle Plugin version

### Android SDK Not Found
**Issue**: Build fails with errors about missing Android SDK.

**Solution**:
1. Ensure your `local.properties` file exists and points to the correct Android SDK location
2. If using Android Studio, let it generate the `local.properties` file for you
3. Make sure the Android SDK has the required platforms and build tools installed

### Capacitor Update Issues
**Issue**: After running `npx cap update android`, build fails due to configuration changes.

**Solution**:
1. Check the Java version in the generated files (especially `capacitor.build.gradle`)
2. Revert any changes to Java version from VERSION_21 to VERSION_17
3. Ensure Android Gradle Plugin versions remain consistent

## Maintenance Tips

1. **After Capacitor Updates**: Always check Java version references in generated files
2. **After Gradle Updates**: Ensure compatibility with Android Gradle Plugin version
3. **Keep Dependencies Updated**: Regularly update dependencies but test builds after updates
4. **Version Control**: Commit working build configurations to avoid losing working setups

## APK Installation

1. Transfer the APK to your Android device
2. Enable "Install from Unknown Sources" in your device settings
3. Install the APK by tapping on it in your file manager
4. For testing on multiple devices, consider using a distribution platform like Firebase App Distribution

## Troubleshooting

If you encounter build issues:

1. Check the error logs for specific error messages
2. Verify Java version consistency across all build files
3. Ensure Gradle plugin versions are compatible
4. Check that your Android SDK has all required components installed
5. Try cleaning the build with `.\gradlew.bat clean` before rebuilding

## References

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Gradle Plugin Documentation](https://developer.android.com/studio/build)
- [Gradle Compatibility Matrix](https://developer.android.com/studio/releases/gradle-plugin#updating-gradle)
