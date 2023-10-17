import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aryanReality.app',
  appName: 'AryanRealtyCRM',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
		SplashScreen: {
		  launchAutoHide: false,
		  androidScaleType: "CENTER_CROP",
		  showSpinner: true,
		  androidSpinnerStyle: "large",
		  iosSpinnerStyle: "small"
		},
		PushNotifications: {
			presentationOptions: ["badge", "sound", "alert"],
		  },
	  },
	  
};

export default config;
