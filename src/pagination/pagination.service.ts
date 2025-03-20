import { Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationService {
    async paginate<T extends ObjectLiteral>(repository:Repository<T>, page= 1 , limit= 4){
        const take=limit;
        const skip=(page-1) * limit;
        const [data,total]=await repository.findAndCount({
            skip,
            take,
        });
        return{
            data,total,page,limit, totalPages:Math.ceil(total / limit),
        };
    }
}
