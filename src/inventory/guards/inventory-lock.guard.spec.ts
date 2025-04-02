import { InventoryLockGuard } from './inventory-lock.guard';
import { InventoryService } from 'src/inventory/inventory.service';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('InventoryLockGuard', () => {
  let guard: InventoryLockGuard;
  let inventoryService: Partial<InventoryService>;

  beforeEach(async () => {
    inventoryService = {
      getActiveInventory: jest.fn().mockResolvedValue(null) 
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryLockGuard,
        { provide: InventoryService, useValue: inventoryService },
        { provide: Reflector, useValue: { get: jest.fn() } } 
      ],
    }).compile();

    guard = module.get<InventoryLockGuard>(InventoryLockGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
