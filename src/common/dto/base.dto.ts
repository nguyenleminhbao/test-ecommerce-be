import { plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  static plainToClass<T>(this: any, obj: T): T {
    return plainToInstance(this, obj, { excludeExtraneousValues: true });
  }
}
