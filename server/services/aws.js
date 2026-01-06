const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Upload } = require('@aws-sdk/lib-storage');
const sharp = require('sharp');
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { PassThrough } = require('stream');
const { pipeline } = require('stream/promises');
const { HeadObjectCommand } = require('@aws-sdk/client-s3'); 

const client = new S3Client({
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function getSignedUploadUrl(path, props = {}) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    // ACL: 'public-read',
    Key: path,
    ...props,
  });

  return getSignedUrl(client, command, { expiresIn: 60 * 5 });
}

function deleteObject(path) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: path,
  });

  return client.send(command);
}

async function resizeAndUploadImage(
  path,
  newPath,
  { dimensions = { width: 400, height: 300 } } = {}
) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: path,
  });
  // Get the object as a stream
  const data = await client.send(getObjectCommand);
  const readStream = data.Body;

  // Resize the image using sharp
  const resizeStream = sharp().resize(dimensions.width, dimensions.height);
  const passThrough = new PassThrough();

  const pipelinePromise = pipeline(readStream, resizeStream, passThrough);
  const uploadPromise = upload(newPath, passThrough);

  try {
    const [result] = await Promise.all([uploadPromise, pipelinePromise]);
    return result;
  } catch (err) {
    readStream.destroy();
    resizeStream.destroy();
    passThrough.destroy();
    throw err;
  }
}

async function upload(newPath, transformedStream) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    // ACL: 'public-read',
    Key: newPath,
    Body: transformedStream,
  };

  const uploader = new Upload({ client, params });
  await uploader.done();

  return `https://${process.env.S3_BUCKET}.s3-${process.env.S3_REGION}.amazonaws.com/${newPath}`;
}

// ------------------------------
// SAVE RAW FILE TO S3
// ------------------------------
async function saveRawFile(key, buffer, contentType) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  const uploader = new Upload({ client, params });
  await uploader.done();

  return `https://${process.env.S3_BUCKET}.s3-${process.env.S3_REGION}.amazonaws.com/${key}`;
}

async function headObjectExists(path) {
  try {
    const cmd = new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: path });
    await client.send(cmd);
    return true;
  } catch (e) {
    return false; // 404 yoki ruxsat yo'q bo'lsa false
  }
}

module.exports = {
  getSignedUploadUrl,
  deleteObject,
  resizeAndUploadImage,
  upload,
  saveRawFile,
  headObjectExists,
};
