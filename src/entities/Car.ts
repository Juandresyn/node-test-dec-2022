import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn()
  carId: number;

  @Column({
    unique: true,
  })
  id: string;

  @Column()
  maker: string;

  @Column()
  model: number;

  @Column()
  ref: string;

  @Column()
  color: string;

  @Column()
  milage: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
