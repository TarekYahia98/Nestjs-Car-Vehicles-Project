import { Expose } from 'class-transformer';


export class tokensDto {
  
 @Expose()
 id: number;
 
 @Expose()
 email: string;

 @Expose()
 admin: Boolean;

 @Expose()
 accessToken: String;

 @Expose()
 refreshToken: String;
}