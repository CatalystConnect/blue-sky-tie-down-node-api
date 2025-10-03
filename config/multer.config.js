const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files"); // The folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// const imageFileFilter = (req, file, cb) => {
//   if (!/\.(png|jpg|jpeg|heic|gif|bmp|xlsx)$/i.test(file.originalname)) {
//     cb(new Error("File limit exceeded"), false);
//     return req.res.status(400).json({
//       status: false,
//       message: "File limit exceeded! You can only upload up to 5 files.",
//       errorCode: 413, // HTTP 413: Payload Too Large
//       data: {},
//     });
//   }
//   cb(null, true);
// };
const imageFileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = /\.(png|jpg|jpeg|webp|jpegh|heic|gif|csv|xlsx)$/i;
  // Check for invalid file extension
  if (!allowedExtensions.test(file.originalname)) {
    cb(new Error("Invalid file extensions"), false);
    return req.res.status(400).json({
      status: false,
      message:
        "Invalid file extension! You can only upload PNG, JPG, JPEG, HEIC, GIF,WEBP",
      errorCode: 422,
      data: {},
    });
  }

  // Check if file count exceeds the limit (5 files)
  if (req.files && req.files.length > 5) {
    cb(new Error("File limit exceeded"), false);
    return req.res.status(400).json({
      status: false,
      message: "File limit exceeded! You can only upload up to 5 files.",
      errorCode: 413,
      data: {},
    });
  }

  cb(null, true);
};

const imageUpload = multer({ storage, fileFilter: imageFileFilter });

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
});

const multiUpload = multer({
  storage,
}).fields([
  { name: "completedFiles", maxCount: 5 },
  { name: "avatar", maxCount: 1 },
  { name: "doc1File", maxCount: 1 },
  { name: "doc2File", maxCount: 1 },
  { name: "doc3File", maxCount: 1 },
  { name: "doc4File", maxCount: 1 },
  { name: "doc5File", maxCount: 1 },
  { name: "doc6File", maxCount: 1 },
  { name: "doc7File", maxCount: 1 },
  { name: "doc8File", maxCount: 1 },
  { name: "doc9File", maxCount: 1 },
  { name: "doc10File", maxCount: 1 },
  { name: "doc11File", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "itemImages[0]", maxCount: 10 },
  { name: "itemImages[1]", maxCount: 10 },
  { name: "itemImages[2]", maxCount: 10 },
  { name: "itemImages[3]", maxCount: 10 },
  { name: "itemImages[4]", maxCount: 10 },
  { name: "itemImages[5]", maxCount: 10 },
  { name: "itemImages[6]", maxCount: 10 },
  { name: "itemImages[7]", maxCount: 10 },
  { name: "itemImages[8]", maxCount: 10 },
  { name: "itemImages[9]", maxCount: 10 },
  // Diagrams Images - measures2D
  { name: "diagramsImages[measures2DImage][0]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][1]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][2]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][3]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][4]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][5]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][6]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][7]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][8]", maxCount: 10 },
  { name: "diagramsImages[measures2DImage][9]", maxCount: 10 },

  // ✅ New: Diagrams Images - diagram2D
  { name: "diagramsImages[diagram2DImage][0]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][1]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][2]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][3]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][4]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][5]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][6]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][7]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][8]", maxCount: 10 },
  { name: "diagramsImages[diagram2DImage][9]", maxCount: 10 },

  // ✅ New: Diagrams Images - satellite
  { name: "diagramsImages[satelliteImage][0]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][1]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][2]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][3]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][4]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][5]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][6]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][7]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][8]", maxCount: 10 },
  { name: "diagramsImages[satelliteImage][9]", maxCount: 10 },

 // ✅ New: Project Location Photos
{ name: "projectImages[projectLocationPhotos][side2OfProject][0]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][1]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][2]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][3]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][4]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][5]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][6]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][7]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][8]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side2OfProject][9]", maxCount: 10 },

{ name: "projectImages[projectLocationPhotos][frontOfProject][0]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][1]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][2]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][3]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][4]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][5]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][6]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][7]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][8]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][frontOfProject][9]", maxCount: 10 },

{ name: "projectImages[projectLocationPhotos][side1OfProject][0]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][1]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][2]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][3]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][4]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][5]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][6]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][7]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][8]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][side1OfProject][9]", maxCount: 10 },

{ name: "projectImages[projectLocationPhotos][backOfProject][0]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][1]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][2]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][3]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][4]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][5]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][6]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][7]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][8]", maxCount: 10 },
{ name: "projectImages[projectLocationPhotos][backOfProject][9]", maxCount: 10 },

// ✅ New: Project Special Photos
{ name: "projectImages[projectSpecialPhotos][skyLights][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][skyLights][9]", maxCount: 10 },

{ name: "projectImages[projectSpecialPhotos][penetrations][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][penetrations][9]", maxCount: 10 },

{ name: "projectImages[projectSpecialPhotos][chimneys][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][chimneys][9]", maxCount: 10 },

{ name: "projectImages[projectSpecialPhotos][eave][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][eave][9]", maxCount: 10 },

{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][transitionsToSiding][9]", maxCount: 10 },

{ name: "projectImages[projectSpecialPhotos][overheadElectric][0]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][1]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][2]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][3]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][4]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][5]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][6]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][7]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][8]", maxCount: 10 },
{ name: "projectImages[projectSpecialPhotos][overheadElectric][9]", maxCount: 10 },
]);

module.exports = { upload, imageUpload, multiUpload };
