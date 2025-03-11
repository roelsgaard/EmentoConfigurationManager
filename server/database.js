import { JSONFilePreset } from 'lowdb/node'

const databaseFilename = './database/db.json';
const db = await JSONFilePreset(databaseFilename, {});

export const reloadDatabase = async () => {
  await db.read();
};

export default db;