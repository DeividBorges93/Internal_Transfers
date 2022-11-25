import bcrypt from 'bcrypt';

export default class HashPassword {
  public hash(password: string, length: number) {
    return bcrypt.hashSync(password, length)
  };

  public compareHash(password: string, hasPassword: string) {
    return bcrypt.compareSync(password, hasPassword)
  };
}