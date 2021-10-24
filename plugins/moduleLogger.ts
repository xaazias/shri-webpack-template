import fastGlob from 'fast-glob';
import { extname } from 'path';
import { Compiler } from 'webpack';
import { writeFile } from 'fs/promises';
import path from 'path';

type Options = {
    outputFile?: string;
};

const defaultOptions: Options = {
    outputFile: 'unused',
};

class ModuleLogger {
    options: Options;

    constructor(opts: Options = defaultOptions) {
        this.options = opts;
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterEmit.tap('ModuleLogger', async ({ fileDependencies: fd }) => {
            const unusedSet = new Set(
                await fastGlob(['src/**'], {
                    absolute: true,
                }).then(arr => arr.map(item => path.normalize(item))),
            );

            fd.forEach(item => {
                if (!item.includes('node_modules') || extname(item)) unusedSet.delete(item);
            });

            await this.saveToFile(unusedSet);
        });
    }

    saveToFile(unused: Set<string>) {
        const unusedArr = Array.from(unused.keys()).map(item => item.replace(/\\+/g, '/'));
        const result = JSON.stringify(unusedArr, null, '\t');

        return writeFile(this.options.outputFile, result).catch(err => console.log(err));
    }
}

export default ModuleLogger;
