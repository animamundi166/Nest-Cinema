import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId, ObjectId } from 'mongoose';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform {
  transform(value: ObjectId, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${metadata.data} must be a valid`);
    }

    return value;
  }
}
