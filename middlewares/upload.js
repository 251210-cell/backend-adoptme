// Copia y pega esto tal cual (poniendo tus llaves de Cloudinary)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
  cloud_name: 'tu_nombre', 
  api_key: 'tu_api_key', 
  api_secret: 'tu_api_secret' 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'adoptme' }
});

module.exports = multer({ storage });