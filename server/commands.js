import util from 'util';
import { execFile } from 'child_process';

const command = util.promisify(execFile);

export const commands = {
    async test() {
        const { stderr, stdout } = await command('git', ['status']);
        return { stderr, stdout }; 
    }
};