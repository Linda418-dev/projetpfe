import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    // hasher password 
    async hashPassword(password: string){
        return bcrypt.hash(password, 10);
      }
      
      //Comparer passwod orignal avec le password hasher 
      async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
      }
}
