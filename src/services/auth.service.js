import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import {db} from '#config/database.js';
import {users} from '#models/user.model.js';
import {eq} from 'drizzle-orm';

export const hashPassword = async (password) => {
  try{
    return await bcrypt.hash(password, 10);
  }catch(e){
    logger.error(`Error hashing the password: ${e}`);
    throw new Error('Error hashing', {cause: e});
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try{
    return await bcrypt.compare(password, hashedPassword);
  }catch(e){
    logger.error(`Error comparing the password: ${e}`);
    throw new Error('Error comparing password', {cause: e});
  }
};

export const createUser = async ({name, email, password, role}) => {
  try{
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if(existingUser.length > 0){
      return Promise.reject(new Error('Email already registered'));
    }
        
    const password_hash = await hashPassword(password);
    const [newUser] = await db.insert(users)
      .values({name, email, password:password_hash, role})
      .returning({
        id: users.id, 
        name: users.name, 
        email: users.email,
        role: users.role,
        created_at: users.createdAt
      }
      );

    logger.info(`User ${newUser.email} registered successfully successfully`);
    return newUser;
  }catch(e){
    logger.error(`Error creating the user: ${e}`);
    throw e;
  }
};

export const authenticateUser = async ({email, password}) => {
  try{
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      password: users.password
    }).from(users).where(eq(users.email, email)).limit(1);

    if(!user){
      return Promise.reject(new Error('User not found'));
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
      return Promise.reject(new Error('Invalid password'));
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }catch(e){
    logger.error(`Error authenticating the user: ${e}`);
    throw e;
  }
};

