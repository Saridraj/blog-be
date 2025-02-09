import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  username: string;

  @Column()
  avatarURL: string;

  @Column()
  createdAt: Date;
}
