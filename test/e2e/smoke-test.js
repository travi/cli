import {execa} from 'execa';
import {getBinPath} from 'get-bin-path';

await execa(await getBinPath(), ['--help']);
