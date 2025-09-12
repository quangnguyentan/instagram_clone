// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const resourceType = file.mimetype.startsWith('video')
        ? 'video'
        : 'image';
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
            return reject(new Error('Không nhận được kết quả từ Cloudinary'));
          }
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    } catch (error) {
      console.error('Xoá ảnh thất bại:', error);
      throw error;
    }
  }
}
