import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dfqcptgtp" , // Click 'View API Keys' above to copy your cloud name
        api_key: process.env.CLOUDINARY_API_KEY || '246243655328135', // Click 'View API Keys' above to copy your API key
        api_secret: process.CLOUDINARY_API_SECRET || "P1o3JQfnbW6HAeLxBsh7DYApvjk" // Click 'View API Keys' above to copy your API secret
    });
    
    // console.log(process.env.CLOUDINARY_CLOUD_NAME ,process.env.CLOUDINARY_API_KEY,process.CLOUDINARY_API_SECRET)
    const uploadOnCloudinary = async (filePath) => {
try{
if (!filePath) {
        throw new Error('File path is required for upload');
    }
   const response = await cloudinary.uploader.upload(filePath,{
        resource_type: 'auto',
    })
    console.log("File uploaded successfully:", response.url);
    return response
}catch (error) {
    fs.unlinkSync(filePath); // Clean up the file after upload
        console.error("Error uploading file to Cloudinary:", error);
        throw error; // Re-throw the error for further handling
    }

}

export { uploadOnCloudinary, cloudinary };
    