const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to strip quotes from a string
function stripQuotes(str) {
  if (typeof str === 'string' && str.length >= 2 && str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
    return str.substring(1, str.length - 1);
  }
  return str;
}

// Strip quotes from each config value if present
Object.keys(config).forEach((key) => {
  config[key] = stripQuotes(config[key]);
});

export const firebaseConfig = config;