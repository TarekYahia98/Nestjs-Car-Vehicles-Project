import { User } from '../users/user.entity';
import {
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  long: number; //longitude

  @Column()
  lat: number; //latitude

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  // Hooks
  @AfterInsert()
  logInsert() {
    console.log(`Inserted Report with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    if (this.approved === true) {
      console.log(`Approved Report with id ${this.id}`);
    } else {
      console.log(`Rejected Report with id ${this.id}`);
    }
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed Report`);
  }
}
