import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { BadRequestException } from '@nestjs/common';

const scrypt = promisify(_scrypt);

/**
 * Using input password to compare with stored password
 * @param inputPassword user input password
 * @param comparedPassword password stored in database
 * @returns true if password is correct
 */
export async function passwordDecoder(
  inputPassword: string,
  comparedPassword: string,
): Promise<boolean> {
  const [salt, storedHash] = comparedPassword.split('.');
  const hash = (await scrypt(inputPassword, salt, 32)) as Buffer;
  if (storedHash !== hash.toString('hex')) {
    throw new BadRequestException('wrong password');
  } else {
    return true;
  }
}
