import {OneToMany, AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../reports/report.entity';


@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id:number;

   @Column({ default: true })
   Admin: boolean;

   @Column()
   email:string;

   @Column()
   password:string;

   @OneToMany(()=> Report , (report) => report.user)
   reports: Report[];

   // Hooks
   @AfterInsert()
   logInsert() {console.log (`Inserted User with id ${this.id}`)};

   @AfterUpdate()
   logUpdate() {console.log (`Updated User with id ${this.id}`)};

   @AfterRemove()
   logRemove() {console.log (`Removed User with Email ${this.email}`)};

}