import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
  getLatihan():string {
    return 'latihan';
  }

  hello():string {
    return 'Hello World!';
  }

  getAge():number {
    return 16;
  }

  
}
