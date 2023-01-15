import { ConfigService } from '@nestjs/config';

export const getMongoConfig = async (config: ConfigService) => ({
  uri: config.get<string>('MONGODB_URI'),
});
