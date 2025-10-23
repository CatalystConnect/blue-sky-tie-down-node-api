const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

const credentialsPath = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
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
// async function uploadFileToDrive(filePath, fileName, mimeType, folderPath = null) {
//   let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // main folder (blueSkyFiles)

//   if (folderPath) {
//     if (Array.isArray(folderPath)) {
//       // Nested folders
//       folderId = await getOrCreateNestedFolders(folderId, folderPath);
//     } else {
//       // Single folder
//       folderId = await getOrCreateSubfolder(folderId, folderPath);
//     }
//   }
//   const fileMetadata = {
//     name: fileName,
//     parents: [folderId],
//   };

//   const media = {
//     mimeType,
//     body: fs.createReadStream(filePath),
//   };

//   const file = await drive.files.create({
//     requestBody: fileMetadata,
//     media,
//     fields: "id, webViewLink",
//     supportsAllDrives: true,
//   });

//   return file.data;
// }
async function uploadFileToDrive(
  filePath,
  fileName,
  mimeType,
  folderPath = null
) {
  let folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (folderPath) {
    if (typeof folderPath === "string") {
      // folderPath is already ID
      folderId = folderPath;
    } else if (Array.isArray(folderPath)) {
      // Nested folders by name
      folderId = await getOrCreateNestedFolders(folderId, folderPath);
    } else {
      // Single folder name
      folderId = await getOrCreateSubfolder(folderId, folderPath);
    }
  }

  const fileMetadata = { name: fileName, parents: [folderId] };
  const media = { mimeType, body: fs.createReadStream(filePath) };

  const file = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, webViewLink",
    supportsAllDrives: true,
  });

  return file.data;
}

module.exports = {
  uploadFileToDrive,
  getOrCreateSubfolder,
  getOrCreateNestedFolders,
};
