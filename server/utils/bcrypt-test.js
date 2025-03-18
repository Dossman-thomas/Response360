import bcrypt from 'bcrypt';
import { hashPassword } from './hash-pass.util.js';

async function testHashAndCompare() {
  const userPassword = "Admin@123!";
  const newHash = await hashPassword(userPassword);
  console.log("New Hash:", newHash);

  const match = await bcrypt.compare(userPassword, newHash);
  console.log("Does password match with newly hashed one?", match); // Should be 'true'
}

testHashAndCompare();

