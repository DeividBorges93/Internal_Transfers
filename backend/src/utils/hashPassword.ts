import bcrypt from 'bcrypt';

  const hash = (password: string, length: number) => {
    return bcrypt.hashSync(password, length)
  };

  const compareHash = (password: string, hasPassword: string) => {
    return bcrypt.compareSync(password, hasPassword)
  };

  export {
    hash,
    compareHash
  };
