import bcrypt from 'bcrypt';

export default class HashPassword {
  public hash(password: string, length: number) {
    return bcrypt.hashSync(password, length)
  }
}