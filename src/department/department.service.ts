import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentRepository } from './repositories/department.repository';
import { CreateDepartmentDto } from './types/dto/create-department.dto';
import { UpdateDepartmentDto } from './types/dto/update-department.dto';

@Injectable()
export class DepartmentService {
     constructor(private readonly departmentRepository : DepartmentRepository
      ){}
       
        async getAllDepartments() {
            return this.departmentRepository.find();
        }

        async getDepartmentById(id: string) {
            const fetchDepartment= await this.departmentRepository.findOneBy({id : id });
             if (!fetchDepartment){
                throw new BadRequestException(`Department with id ${id} not found`);
            }
            return fetchDepartment;
        }
        async createDepartment(createDepartmentDto: CreateDepartmentDto) {
            const department = this.departmentRepository.create(createDepartmentDto);
            return this.departmentRepository.save(department);
        }
    
        async updateDepatment(id: string, updatedepartmentDto: UpdateDepartmentDto) {
            const fetchDepartment = await this.getDepartmentById(id);
            if (!fetchDepartment) {
                throw new BadRequestException(`Department with id ${id} not found`);
            }
            Object.assign(fetchDepartment, updatedepartmentDto);
            return this.departmentRepository.save(fetchDepartment);
        }
    
        async deleteDepartment(id: string): Promise<{ message: string }> {
            const result = await this.departmentRepository.delete(id);
            
            if (result.affected === 0) {
                throw new NotFoundException('Department not found');
            }
            
            return { message: 'Department deleted successfully' };
        }
}
