// To Limit our info Shared

import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable} from "rxjs";
import { map,} from 'rxjs/operators';
import { plainToClass } from "class-transformer";

// instead of using (any) DataType and should use Class as DataType 
interface ClassConstructor {
    new (...args:any[]):{}
}


// Custom Decorator For SerializeInterceptor => (instead of using that) => @UseInterceptors(new SerializeInterceptor(UserDto))
export function serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}


export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto:any){}
intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
   return next.handle().pipe(
    map((data:any)=> {
     return plainToClass(this.dto, data, {
        excludeExtraneousValues: true,
     })
    })

   )
 }
}