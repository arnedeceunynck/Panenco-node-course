import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@Exclude()
export class UserView {
  // If we want to exclude this id property for example we can just omit it from the class or explicitly place a @Exclude() decorator on the property.
  @Expose()
  @IsNumber()
  public id: number;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsEmail()
  public email: string;
}