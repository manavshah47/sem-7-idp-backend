// aws s3 client import
const s3Client = require("../config/aws-s3")

// insert file and get file function import
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")

// signed url function import
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

// crypto for random string generation
const crypto = require("crypto")

const sharp = require("sharp")

// function to get signed url from image location
const getPDFSignedURL = async (attachmentURL) => {
    // set bucket name and image location
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: attachmentURL,
        ResponseContentDisposition: 'inline',
        ResponseContentType: "application/pdf"
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
const uploadPDFFile = async (file, folder) => {
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
    let finalFileKey = folder + "/" + fileName + ".pdf";

    // upload params as per aws
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileContent,
        Key: finalFileKey,
        contentType:'application/json',
        ContentDisposition: 'inline'
    }

    // actual upload of file in aws
    await s3Client.send(new PutObjectCommand(uploadParams)); 

    // return file key (fike key is stored in database)
    return finalFileKey
}

const getImageSignedUrl = async (imgURL) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imgURL
    }


    
    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const seconds = 3600
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
    return url
}

// actual implementation of get url of uploaded file in s3
const uploadImageFile = async (files, folder) => {
    const fileName = crypto.randomBytes(16).toString('hex') // generating random file name
    // const fileContent = Buffer.from(files.file.data, 'binary') // creating buffer from actual file

    
    const fileContent2 = await sharp(files.file.data)
        .resize({
          width: 365,
          height: 365
        })
    .jpeg({quality:80})
    .toBuffer();
    
    // all campaign images will be stored inside campaign folder in s3
    let finalFileKey = `${folder}/${fileName}`;

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileContent2,
        Key: finalFileKey
    }

    await s3Client.send(new PutObjectCommand(uploadParams)); // uploading of resume will be done here
    return finalFileKey
}


module.exports = {
    getPDFSignedURL,
    uploadPDFFile,
    getImageSignedUrl,
    uploadImageFile
}