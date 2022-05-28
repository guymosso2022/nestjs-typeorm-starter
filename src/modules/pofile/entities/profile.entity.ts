import { User } from "src/modules/user/entities/user.entity";
import { AbstractEntity } from "src/shared/common/classes/abstract-entity";
import { Gender } from "src/shared/common/enums/gender.enum";
import { Role } from "src/shared/common/enums/role.enum";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";

@Entity('profiles')
@Unique(['phoneNumber'])
export class Profile extends AbstractEntity{

    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({
      nullable:true
    })
    gender: Gender;
  
    @Column({
      nullable:true
    })
    age: number;
  
    @Column({
      nullable:true
    })
    country: string;
  
    @Column({
      nullable:true
    })
    city: string;
  
    @Column({
      nullable:true
    })
    address: string;

    @Column({
      nullable:true
    })
    email: string;
  
    @Column({
      nullable:true
    })
    phoneNumber: string;
  
    @Column({
      nullable: true
    })
    image: string;

    @Column({
      type: 'enum',
      enum: Role,
      default: Role.USER,
    })
    roles: Role[];

    @ManyToOne(() => User, user => user.profile, {
        eager: false
    })
    user: User;
}