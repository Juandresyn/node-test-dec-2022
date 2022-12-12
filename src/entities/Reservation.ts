import { JoinColumn, Entity, Column, CreateDateColumn, OneToOne, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Car } from './Car';
import { User } from './User';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    type => User
  )
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToOne(
    type => Car
  )
  @JoinColumn({
    name: 'car_id',
  })
  car: Car;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  notes: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
