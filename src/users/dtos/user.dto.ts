// DTO For Outing User Entity instance Response
import { Expose } from 'class-transformer';


export class UserDto {
  
 @Expose()
 id: number;
 
 @Expose()
 email: string;

 @Expose()
 admin: Boolean;
}