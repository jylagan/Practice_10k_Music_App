import 'dotenv/config';

export default {
  "expo": {
    "name": "Practice_10k_Music_App",
    "slug": "Practice_10k_Music_App",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "supabaseUrl": process.env.SUPABASE_URL,
      "supabaseKey": process.env.SUPABASE_KEY
    }
  }
}
