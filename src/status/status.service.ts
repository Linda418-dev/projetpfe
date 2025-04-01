import { Injectable, OnModuleInit } from '@nestjs/common';
import { StatusRepository } from './repositories/status.repository';
import { StatusEnum } from './types/enums/status.enum';

@Injectable()
export class StatusService implements OnModuleInit { 
    constructor(private readonly statusRepository: StatusRepository) {}

    async onModuleInit() {
        console.log('⚡ Seeding statuses...');
        await this.seedStatuses();
        console.log('✅ Statuses seeded successfully!');
    }

    async seedStatuses() {
        const statuses = Object.values(StatusEnum);

        for (const statusName of statuses) {
            const existingStatus = await this.statusRepository.findOne({ where: { name: statusName } });

            if (!existingStatus) {
                const status = this.statusRepository.create({ name: statusName });
                await this.statusRepository.save(status);
                console.log(`✅ Status "${statusName}" created!`);
            }
        }
    }
}
