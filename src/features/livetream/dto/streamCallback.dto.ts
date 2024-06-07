import { IsBoolean, IsString } from 'class-validator';

export class StreamCallbackDto {
  @IsString()
  event: string;
  @IsString()
  room_id: string;
  @IsString()
  user_id: string;
  @IsString()
  user_name: string;
}
