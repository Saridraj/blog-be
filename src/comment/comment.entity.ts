import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Comments {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  comment: string;

  @Column()
  postId: string;

  @Column()
  createdBy: string;

  @Column()
  createdAt: Date;
}
