import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InventoryService } from 'src/inventory/inventory.service';
import { Request } from 'express'; 
// guard pour controler l'accés  aux routes  HTTP quand un  inventaire  est en cours 
@Injectable()
export class InventoryLockGuard /*implements CanActivate */{
    constructor(
      private readonly inventoryService: InventoryService,
      private readonly reflector: Reflector
    ) {}
  
    /*async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const user: any = request.user;
      const method = request.method;
      
      // Check if the method bypasses the inventory lock
      const bypassLock = this.reflector.get<boolean>('bypassInventoryLock', context.getHandler());
      if (bypassLock) {
        return true;
      }
      
      // Get active inventory
      const activeInventory = await this.inventoryService.getActiveInventory();
      
      // If there is an active inventory, restrict POST, PATCH, DELETE for non-admins
      if (activeInventory) {
        if (['POST', 'PATCH', 'DELETE'].includes(method)) {
          // Only allow admin to modify inventory or close it
          if (user?.role === 'admin' && request.url.includes('/Inventories/close')) {
            return true; // Allow closing of the inventory
          }
          throw new ForbiddenException('No changes allowed during an active inventory!');
        }
      }
  
      return true; // Allow if no active inventory
    }*/
  }
  

