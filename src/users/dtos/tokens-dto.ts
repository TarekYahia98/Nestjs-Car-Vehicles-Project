import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class tokensDto {
  
 @Expose()
 id: number;
 
 @Expose()
 email: string;

 @Expose()
 admin: Boolean;

 @Expose()
  @ApiProperty({ type: String, description: "accessToken"})
  accessToken: String;

  @Expose()
  @ApiProperty({ type: String, description: "refreshToken"})
  refreshToken: String;
}