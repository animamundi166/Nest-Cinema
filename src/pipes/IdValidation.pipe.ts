import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${metadata.data} must be a valid`);
    }

    return value;
  }
}
