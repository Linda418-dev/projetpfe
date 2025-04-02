import { SetMetadata } from '@nestjs/common';

export const BypassInventoryLock = () => SetMetadata('bypassInventoryLock', true);
