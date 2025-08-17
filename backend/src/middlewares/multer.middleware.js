import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    (Math.random() * 1E9).toString(36);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({
  storage: storage,
})
