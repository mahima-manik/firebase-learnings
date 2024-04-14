# firebase-learnings
NodeJS project covering all important Firebase concepts like Auth, storage, firestore, cloud functions


### How to run

1. Install dependencies listed in package.json using:
```
npm install
```

2. Create `.env` file and add environment variables:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

3. Run the project using:
```
npm run dev
```

### Setting up Cloud functions

```bash
npm install -g firebase-tools

// Select an existing project and language as JavaScript, I did not select ESLint and install dependencies
firebase init functions 

// Add project ID if not already added in previous step. This may require firebase logout and login
firebase use --add <PROJECT-ID>

cd functions
npm install @google-cloud/vision
```

Add `"type": "module"` to `package.json` in functions directory.

### Deploying Cloud functions

You can check locally for any errors in function using:
    `firebase emulators:start`

Deploy functions using:

```
firebase deploy --only functions
```

This will deploy all functions in `functions/index.js` file. If the function with same name already exists, it will be updated.
