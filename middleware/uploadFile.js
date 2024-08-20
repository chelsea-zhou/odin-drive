// const multer = require('multer');

// // Set up storage engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, '../uploads'); // Set the directory where files will be stored
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${file.name}`); // Set the file name
//     }
//   });

// // Initialize multer with the storage engine
// const upload = multer({ storage: storage });

// module.exports = {
//     upload
// }