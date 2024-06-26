import { headers } from "next/headers";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./config";

// Initialize Firebase app on the server side only
const firebaseApp = initializeApp(firebaseConfig);

export async function getAuthenticatedAppForUser() {
  const idToken = headers().get("Authorization")?.split("Bearer ")[1];
  console.log('firebaseConfig', JSON.stringify(firebaseConfig));
  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}