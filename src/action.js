import {scaffold} from '@travi/project-scaffolder/lib/index.cjs';
import {javascript} from './enhanced-scaffolders';

export default function () {
  return scaffold({languages: {JavaScript: javascript}, overrides: {copyrightHolder: 'Matt Travi'}})
    .catch(err => {
      console.error(err);     // eslint-disable-line no-console
      process.exitCode = (err.data && err.data.code) || 1;
    });
}
