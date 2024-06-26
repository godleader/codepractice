import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getInstallations, getToken } from "firebase/installations";

// Firebase config object
let firebaseConfig;

self.addEventListener('install', event => {
  // Extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get('firebaseConfig');
  
  if (!serializedFirebaseConfig) {
    throw new Error('Firebase Config object not found in service worker query string.');
  }
  
  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  console.log("Service worker installed with Firebase config", firebaseConfig);
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

// Function to fetch with Firebase headers
async function fetchWithFirebaseHeaders(request) {
  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);

  // Get Auth instance and Installations instance
  const auth = getAuth(app);
  const installations = getInstallations(app);

  // Clone request headers
  const headers = new Headers(request.headers);

  try {
    // Get tokens asynchronously
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);

    // Append Firebase headers to request
    headers.append("Firebase-Instance-ID-Token", installationToken);
    if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);

    // Create new request with updated headers
    const newRequest = new Request(request, { headers });

    // Fetch the new request
    const response = await fetch(newRequest);
    return response;
  } catch (error) {
    console.error('Error fetching with Firebase headers:', error);
    throw error;
  }
}

// Function to get Authentication ID token
async function getAuthIdToken(auth) {
  try {
    await auth.authStateReady();
    if (!auth.currentUser) return null;
    const idToken = await getIdToken(auth.currentUser);
    return idToken;
  } catch (error) {
    console.error('Error getting auth ID token:', error);
    throw error;
  }
}
