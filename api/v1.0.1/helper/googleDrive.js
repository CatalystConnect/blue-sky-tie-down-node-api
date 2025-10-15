const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

  const credentialsPath = JSON.parse(process.env.GOOGLE_CREDENTIALS);
// const credentialsPath = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString());
// console.log('===', credentialsPath)

// const credentialsPath = JSON.parse(decoded);

// const credentialsPath = {
//   type: "service_account",
//   project_id: "candidatecvupload",
//   private_key_id: "485201a850127b70484edefdc96381df943cc541",
//   private_key: `-----BEGIN PRIVATE KEY-----
// MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwBEsoyQUMXADb
// fwRt4SDcz4+5YUneXKXtUh4Bz6TW5v961HVKlfrcX+H9l1f9lD9LyGPUC29Xme0g
// caMB+vZQUpj9YHPduPcVh0mNjIA/3wrjUyFG9E4ef3kf5RBNvOQL69Xc+01sN+73
// PJKD9pAyBk6SqxSTvG5Oy5Mv3U1mt18s1X3vTnmhksW+B6SfFyVp9fI1goG2FByz
// meidyx3EdGxYalD648OJuj5v0vIqt3beMSe3YiY6JjeQTo+194BHVlsugShlpzHi
// J9KV2PKbCJHpsAzifYhTRYNLyz8yzgJMUdWnNol2Co2v5VXrmmRJRxNn4Pmo0b1J
// wrcH4uzzAgMBAAECggEAOVisxBT6OBShkuHHJ6V5d3eIc/Vmg7Pbu35NmHl2Uy3f
// fr1JmYtTuAjlMCHm4Q8zsBURsTwognn7794WJccGCRVgEu0h0tM4bSMuq5djEWwx
// t+6VoPBnozgU1ndi4HDyO5ASlXSqvN9cU+DAO45RXHsBjnd+tMNnjPR2d9m6JgR9
// Y50e/MJQlieFea8Ks2gk/KTOf5bxX9hueC+cn4XZBwE1poQ3HS9P0pinitaKtzvB
// RlfNFrE9gb6c5VJLosaRto1yE8xizI8ff1HDGyFZFg9jBKp9+pJ5RTgh8Wrz9m6p
// XgAIQq1sElBwW9N+D4slfiskWgXvJ7sbQcRnqmWLwQKBgQDpca8AuYEJ4axVQWkZ
// nQJIdzZJhUx2JxQ05ULe8qYpO6mzfOqpUSfhRGrvv7DVWGBrM3YfwaRy3rkPxBWn
// nlGHX48Lx8a8wwKpMFezPcXEHF5GujxwK9RJNyUDkCn2Okean8zGh92BwymPeABy
// MIVMvDfxhgUr3Aqdl34bbVqTlwKBgQDBBiBqSsrg7Mme/dwqGoGIAU5wt298wQvR
// vOgBVY6+ebTMI8wIVGMyh5UDQZCjIX02zdKuZHK9ZH0wkylz4JDpsHHv8yryYtXh
// 0bzo/zQHwHU9OpuT1BoX+tPGsTZeuiXqcpHWNjQeDOPWplfezXvaiFoDOR1leKHf
// X8jDU8etBQKBgGL6U5QAEykoaRQgzroQayZkfT0A6qFyAkxHJGo5AaCb7mDuxuQR
// R9JoWtraMNTUStVJFX1zchFOQ7LelbvjEXhPWOxKwQXJvTgVCioyN8blrEdasUNy
// IekFG4l+N3xxy2hQ9tb6Rj29jMKKw82mqu4VI7cg9tJY0pts3wgr/mpzAoGAX+Ua
// T5ROzIX2+O0n5yb5+Uak4KzRT4pcw9t068zEuO6gGtch83VxPtZK+q4lHFZz7bk9
// lPREaME2zN4ftvj3JZJKWKpXSMo/dgwMLTk0cTF1TXEDf+Lc/9LWSZ0a5N7YHWzD
// 9UdChzdiLe7AMumlQYGCLp2+c/4FdYMRq7DAv70CgYAO27xvHmuIMm30RE9Eo03+
// NGBQ9aDbl3RmyUXqTh8op7nw6FC9XqI65sdw4MwBrrBJzSpk0PZ3z2u/Zg3oLD0n
// gcMtGlv6dPID5qg9AcOKoVnfkbOIWRMnO7jGcSRALuWGsA1d9nvjCEd9ozrfrAfJ
// sVxXyqjwR1Wqx5QqZMNWAQ==
// -----END PRIVATE KEY-----\n`,
//   client_email: "cv-uploader@candidatecvupload.iam.gserviceaccount.com",
//   client_id: "111083964913324186785",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/cv-uploader@candidatecvupload.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com"
// };

//  const credentialsPath = {
//   type: "service_account",
//   project_id: "candidatecvupload",
//   private_key_id: process.env.PRIVATE_KEY_ID,
//   private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), 
//   client_email: "cv-uploader@candidatecvupload.iam.gserviceaccount.com",
//   client_id: process.env.CLIENT_ID,
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//   universe_domain: "googleapis.com"
// };


// const credentialsPath = path.resolve(__dirname, process.env.GOOGLE_CREDENTIALS_PATH);
// const KEYFILEJSON = require(credentialsPath);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
// const auth = new google.auth.JWT({
//   email: credentialsPath.client_email,
//   key: credentialsPath.private_key,
//   scopes: SCOPES,
// });

const auth = new google.auth.JWT({
  email: credentialsPath.client_email,
  key: credentialsPath.private_key,
  scopes: SCOPES,
});
const drive = google.drive({ version: "v3", auth });

/**
 * Get or create a folder under a parent folder
 */
async function getOrCreateSubfolder(parentFolderId, subfolderName) {
  const res = await drive.files.list({
    q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${subfolderName}' and trashed=false`,
    fields: "files(id, name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  const folderMetadata = {
    name: subfolderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: [parentFolderId],
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: "id",
    supportsAllDrives: true,
  });

  return folder.data.id;
}

/**
 * Create nested folder structure dynamically
 * @param {string} parentFolderId - starting parent folder ID (main folder)
 * @param {string[]} folderPathArray - array of folder names e.g. ["projectFiles", "Plan Files", "v1"]
 * @returns {string} - ID of the deepest folder
 */
async function getOrCreateNestedFolders(parentFolderId, folderPathArray) {
  let currentParentId = parentFolderId;

  for (const folderName of folderPathArray) {
    currentParentId = await getOrCreateSubfolder(currentParentId, folderName);
  }

  return currentParentId; // ID of the deepest folder
}

/**
 * Upload a file to Google Drive
 * @param {string} filePath - local file path
 * @param {string} fileName - name in Drive
 * @param {string} mimeType - MIME type of the file
 * @param {string[]|string} folderPath - array of folder names (nested) or single folder name
 */
async function uploadFileToDrive(filePath, fileName, mimeType, folderPath = null) {
  let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // main folder (blueSkyFiles)

  if (folderPath) {
    if (Array.isArray(folderPath)) {
      // Nested folders
      folderId = await getOrCreateNestedFolders(folderId, folderPath);
    } else {
      // Single folder
      folderId = await getOrCreateSubfolder(folderId, folderPath);
    }
  }

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: fs.createReadStream(filePath),
  };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, webViewLink",
    supportsAllDrives: true,
  });

  return file.data;
}

module.exports = { uploadFileToDrive, getOrCreateSubfolder, getOrCreateNestedFolders };
