import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'nubereatsnestjs-bucket-2022';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_KEY,
      },
      region: 'ap-northeast-2',
    });
    try {
      const objName = `${Date.now() + file.originalname}`;
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objName,
          ACL: 'public-read',
        })
        .promise();

      const url = `https://${BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${objName}`;
      return { url };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
