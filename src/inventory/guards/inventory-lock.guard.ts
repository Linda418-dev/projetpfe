import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InventoryService } from 'src/inventory/inventory.service';
import { Request } from 'express'; 

@Injectable()
export class InventoryLockGuard implements CanActivate {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user: any = request.user; 
    const method = request.method; 

    const bypassLock = this.reflector.get<boolean>('bypassInventoryLock', context.getHandler());
    if (bypassLock) {
      return true; 
    }

    const activeInventory = await this.inventoryService.getActiveInventory();
    if (activeInventory) {
      if (['POST', 'PATCH', 'DELETE'].includes(method)) {
        if (user?.role === 'admin' && request.url.includes('/Inventories/close')) {
          return true; 
        }
        throw new ForbiddenException(' No changes allowed during an active inventory !');
      }
    }

    return true; 
  }
}
