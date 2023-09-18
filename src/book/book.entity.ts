import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  deskripsi: string;

  @Column({ default: 2022 })
  year: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
