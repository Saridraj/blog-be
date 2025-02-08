import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Posts {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  topic: string;

  @Column()
  content: string;

  @Column()
  comunity: string;

  @Column()
  createdBy: string;

  @Column()
  createdAt: Date;
}
