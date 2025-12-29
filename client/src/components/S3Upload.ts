/**
 * S3 Upload Helper
 * Handles uploading files to S3 using presigned URLs
 */

import { toast } from "sonner";

export interface UploadResult {
  key: string;
  url: string;
}

export async function uploadToS3(
  file: File,
  fileKey: string,
  contentType: string
): Promise<UploadResult> {
  try {
    // Get the upload URL from the Manus storage API
    const uploadUrl = `/api/storage/upload?path=${encodeURIComponent(fileKey)}`;

    // Create FormData with the file
    const formData = new FormData();
    formData.append("file", file);

    // Upload to S3
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      key: fileKey,
      url: data.url,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
}

export async function uploadPhotoToS3(
  file: File,
  assetId: number,
  companyId: number
): Promise<UploadResult> {
  const fileKey = `companies/${companyId}/assets/${assetId}/photos/${Date.now()}-${file.name}`;
  return uploadToS3(file, fileKey, file.type);
}

export async function uploadAudioToS3(
  file: File,
  assetId: number,
  companyId: number
): Promise<UploadResult> {
  const fileKey = `companies/${companyId}/assets/${assetId}/audio/${Date.now()}-${file.name}`;
  return uploadToS3(file, fileKey, file.type);
}
