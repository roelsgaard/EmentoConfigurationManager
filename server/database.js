import { JSONFilePreset } from 'lowdb/node'

const databaseFilename = './database/db.json';
const db = await JSONFilePreset(databaseFilename, {});

export default db;