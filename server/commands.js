import util from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const command = util.promisify(exec);

export const commands = {
    async getBranches() {
        const { stderr, stdout } = await command('git branch -r --format="%(refname:lstrip=-2)"');
        const branches = stdout.split('\n').map(b => b.replaceAll('\"', "").trim()).filter(Boolean);
        return branches;
    },

    async checkoutBranch(branch) {
        await command(`git checkout ${branch}`);
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
    },

    async saveConfigsToDir(configs) {
        const dirPath = path.join(process.cwd(), 'configurations');
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        configs.forEach(({ customer, config }) => {
            const fileName = `${customer.domain}.json`;
            const filePath = path.join(dirPath, fileName);
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
        });
    },

    async commitAndPushDatabase() {
        const dirPath = path.join(process.cwd(), 'database');
        await command(`git add ${dirPath}`);
        await command(`git commit -m "saving database"`);
        await command('git push');
    },

    async commitAndPushConfigurations() {
        const dirPath = path.join(process.cwd(), 'configurations');
        await command(`git add ${dirPath}`);
        await command(`git commit -m "saving configurations"`);
        await command('git push');
    }
};