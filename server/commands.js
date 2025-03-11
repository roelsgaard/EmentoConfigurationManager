import util from 'util';
import { exec } from 'child_process';

const command = util.promisify(exec);

export const commands = {
    async getBranches() {
        const { stderr, stdout } = await command('git branch -r --format="%(refname:lstrip=-1)"');
        const branches = stdout.split('\n').map(b => b.replaceAll('\"', "").trim()).filter(Boolean);
        return branches;
    },

    async getChangesCount () {
        const { stderr, stdout } = await command('git status --porcelain=v1 2>/dev/null | wc -l');
        const count = parseInt(stdout);
        return count;
    },

    async getChanges () {
        const { stderr, stdout } = await command('git status --porcelain=v1 2>/dev/null');
        
        const changes = stdout.split('\n').map(c => {
            const [status, file] = c.trim().split(' ');
            if(!status || !file) return;
            return { status, file };
        }).filter(Boolean);

        return changes;
    }
};