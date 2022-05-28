import { AbstractEntity } from 'src/shared/common/classes/abstract-entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('verified-email')
@Unique(['email', 'emailToken'])
export class EmailVerification extends AbstractEntity {
  @Column()
  email: string;

  @Column()
  emailToken: string;

  @Column()
  timestamp: Date;
}
