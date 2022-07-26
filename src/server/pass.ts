import bcrypt from "bcrypt";

export function cryptPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(plainPass: string, hashword: string) {
  if (bcrypt.compareSync(plainPass, hashword)) {
    return true;
  }
  return false;
}
