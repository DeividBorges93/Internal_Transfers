import { JwtPayload, sign, SignOptions, verify, Secret } from 'jsonwebtoken';
import 'dotenv/config';

export default class Jwt {
  private secret!: Secret;
  private jwtConfig: SignOptions = { algorithm: 'HS256', expiresIn: '1d' };
  constructor() {
    this.secretInit();
  }

  private secretInit() {
      const secretJwt = process.env.JWT_SECRET as Secret;

      if (!secretJwt) throw { code: 401, message: 'Defina uma chave JWT_SECRET'};

      this.secret = secretJwt;
  }

  public encrypt(user: JwtPayload): string {
    return sign(user, this.secret, this.jwtConfig);
  }

  public decrypt(encryptedText: string): JwtPayload {
    const matchToken = verify(encryptedText, this.secret) as JwtPayload;

    if (!matchToken) throw { code: 401, message: 'Token inválido'};

    return matchToken;
  }
}
