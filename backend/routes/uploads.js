/**
 * /api/uploads — S3 presigned URL endpoints
 *
 * POST /api/uploads/presign
 *   Body: { filename: string, contentType: string }
 *   Returns: { uploadUrl, imageKey }
 *
 * The client uploads the file directly to S3 using the uploadUrl (PUT),
 * then sends imageKey with the product creation request.
 */

const express = require('express');
const router = express.Router();
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { verifyToken } = require('../middleware/auth');

const s3Config = {
  region: process.env.AWS_REGION || 'ap-south-1'
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {})
  };
}

const s3 = new S3Client(s3Config);
const BUCKET = () => process.env.UPLOADS_BUCKET || 'ewaste-uploads-dev';

// ─── POST /api/uploads/presign ────────────────────────────────────────────────

router.post('/presign', verifyToken, async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ message: 'filename and contentType are required' });
    }

    // Scope the key to the user to avoid collisions
    const ext = filename.split('.').pop();
    const imageKey = `uploads/${req.user.username}/${Date.now()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: BUCKET(),
        Key: imageKey,
        ContentType: contentType
      }),
      { expiresIn: 300 } // 5 minutes
    );

    res.json({ uploadUrl, imageKey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── Exported helper: generate a presigned GET URL for displaying an image ───

async function getPresignedGetUrl(imageKey) {
  try {
    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET(), Key: imageKey }),
      { expiresIn: 3600 } // 1 hour
    );
  } catch {
    return null;
  }
}

module.exports = router;
module.exports.getPresignedGetUrl = getPresignedGetUrl;
