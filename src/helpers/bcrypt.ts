import bcrypt from "bcrypt";

const hashValue = async (value: string): Promise<string> => {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(value, salt);
};

const compareValue = async (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue);
};

export { hashValue, compareValue };
