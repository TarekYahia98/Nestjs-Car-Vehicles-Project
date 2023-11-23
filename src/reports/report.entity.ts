import {
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

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  long: number;               //longitude

  @Column()
  lat: number;               //latitude

  @Column()
  mileage: number;



  // Hooks
  @AfterInsert()
  logInsert() {
    console.log(`Inserted Report with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated Report with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed Report with id ${this.id}`);
  }
}
