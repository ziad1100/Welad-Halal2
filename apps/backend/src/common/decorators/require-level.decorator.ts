import { SetMetadata } from '@nestjs/common';

export const RequireLevel = (level: number) => SetMetadata('requiredLevel', level);
