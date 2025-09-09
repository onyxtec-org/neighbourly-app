# Neighbourly

This repository contains the codebase for Neighbourly Mobile App.

# Setup

Follow these steps to get the project running locally:

## Clone the Repository

```
git clone https://github.com/minahilmaroof/Neighbourly.git
```

- Navigate to the Project Directory

```
cd Neighbourly
```

- Install Dependencies

```
npm install
```

- Start the metro bundler

```
# Using npm
npm start

# OR using Yarn
yarn start
```

### Android

- Install the Debug Build

```
Open a new terminal window (keep the previous one running):

cd android

./gradlew installDevelopmentDebug
```

- Launch the App

```
npm run android

Or, simply open the app manually from your device/emulator.
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).
Then

- Install pods

```
Open a new terminal window (keep the previous one running):

cd ios

pod install
```

- Open xcode from terminal

```
Go back to your project

cd ..

Run

open ios/Neighbourly.xcworkspace

This will open xcode
```

- Build App

```
Click on "Product" and then "Build"

This will creat a build for you

Then click on "Run"


