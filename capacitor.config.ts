import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.dishshare',
  appName: 'DishShare',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "GoogleAuth": {
      "scopes": ["profile", "email"],
      "clientId": "443257134397-2p0t94eb1ic9a2ehum2uorbao69b1d6s.apps.googleusercontent.com",
      "androidClientId": "443257134397-2p0t94eb1ic9a2ehum2uorbao69b1d6s.apps.googleusercontent.com",
      "serverClientId": "443257134397-2p0t94eb1ic9a2ehum2uorbao69b1d6s.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
