// aws s3 client import
const s3Client = require("../config/aws-s3")

// insert file and get file function import
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")

// signed url function import
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

// crypto for random string generation
const crypto = require("crypto")

// function to get signed url from image location
const getObjectSignedUrl = async (attachmentURL) => {
    // set bucket name and image location
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: attachmentURL
    }
    
    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    
    // time till url of the image will be valid
    const seconds = 3600
    
    // fetch url of the image from aws
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

    // return fetched url of the image
    return url
}


// actual implementation of upload file in s3
// file is actual file that is going to upload
// folder is folder in which file is going to uplaod (used to store files in diffrent folders such as creator, finance, legal)
const uploadFile = async (file, folder) => {
    // image validation (size and type)
    // const imageType = file.mimetype;
    // const imageSize = file.size;
    // const maxImageSize = 1 * 1024 * 1024; // 1 MB
    
    // actual image validation
    // if(!(imageType == "image/jpg" || imageType == "image/jpeg" || imageType == "image/png")){
    //     return {success:false, message:"Only jpg, jpeg and png type images are accepted"}
    // } else if(imageSize > maxImageSize){
    //     return {success:false, message:"Please select image less than 1 MB"}
    // }

    // generate file name using crypto
    const fileName = crypto.randomBytes(16).toString('hex') // generating random file name
    
    // create binary buffer from the file
    const fileContent = Buffer.from(file.file.data, 'binary') // creating buffer from actual file
    
    // attach folder name and file name (absolute url of the file)
    // all attachments will be stored inside respective folders folder in s3
    let finalFileKey = folder + "/" + fileName;

    // upload params as per aws
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileContent,
        Key: finalFileKey
    }

    // actual upload of file in aws
    await s3Client.send(new PutObjectCommand(uploadParams)); 

    // return file key (fike key is stored in database)
    return {success: true, imageURL: finalFileKey}
}

module.exports = {
    getObjectSignedUrl,
    uploadFile
}