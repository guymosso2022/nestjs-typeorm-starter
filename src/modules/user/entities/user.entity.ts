import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from '../../../shared/common/classes/abstract-entity';
import { Profile } from 'src/modules/pofile/entities/profile.entity';

@Entity('users')
@Unique(['userName', 'email'])
export class User extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'boolean', default: false})
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true})
  gmailId: string;

  @Column({ type: 'varchar', nullable: true})
  facebookId: string;

  @OneToMany(() => Profile, profile => profile.user,{
    eager: true
  })
  profile: Profile;
}
