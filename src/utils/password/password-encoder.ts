import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

export async function passwordEncoder(password: string): Promise<string> {
  const salt = Buffer.from(process.env.PASSWORD_SALT).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  const result = salt + '.' + hash.toString('hex');
  return result;
}
