import inquirer from 'inquirer';
import { printRow, printError, isUndefined } from './utils';
import Listr from 'listr';
import path from 'path';

const getName = str => str
    .replace(/\_/g, '-')
    .split('-')
    .filter(i => i)
    .map(i => i[0].toUpperCase() + i.slice(1))
    .join(' ');

const createSourceFiles = (opts = {}) => {
    // File creation
        // Add .gitignore if doesn't exists yet
        // Check also package.json if exists
};

const createFileComponents = (opts = {}) => {
};

const createFileBlocks = (opts = {}) => {
};

const updatePackage = (opts = {}) => {
};

export const initPlugin = async(opts = {}) => {
    printRow('Start file creation...');
    const tasks = new Listr([
        {
            title: 'Creating initial source files',
            task: () => createSourceFiles(opts),
        }, {
            title: 'Creating custom Component Type file',
            task: () => createFileComponents(opts),
            enabled: () => opts.components,
        }, {
            title: 'Creating Blocks file',
            task: () => createFileBlocks(opts),
            enabled: () => opts.components,
        }, {
            title: 'Update package.json',
            task: () => updatePackage(opts),
        },
    ]);
    await tasks.run();
}

export default async (opts = {}) => {
    printRow('Init the project...');
    const rootDir = path.basename(process.cwd());
    const {
        verbose,
        name,
        rName,
        user,
        yes,
        components,
        blocks,
    } = opts;
    let results = {
        name: name || getName(rootDir),
        rName: rName || rootDir,
        user: user || 'YOUR-USERNAME',
        components: components || true,
        blocks: blocks || true,
    };

    const questions = [];

    if (!yes) {
        !name && questions.push({
            name: 'name',
            message: 'Name of the project',
            default: results.name,
        });
        !rName && questions.push({
            name: 'rName',
            message: 'Repository name (used also as the plugin name)',
            default: results.rName,
        });
        !user && questions.push({
            name: 'user',
            message: 'Repository username (eg. on GitHub/Bitbucket)',
            default: results.user,
        });
        isUndefined(components) && questions.push({
            type: 'boolean',
            name: 'components',
            message: 'Will you need to add custom Component Types?',
            default: results.components,
        });
        isUndefined(blocks) && questions.push({
            type: 'boolean',
            name: 'blocks',
            message: 'Will you need to add Blocks?',
            default: results.blocks,
        });
    }

    const answers = await inquirer.prompt(questions);
    results = {
        ...results,
        ...answers,
    }

    await initPlugin(results);
    printRow('Project created! Happy coding');
}