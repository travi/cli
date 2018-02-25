import {exec} from 'shelljs';

export default async function (dependencies) {
  if (dependencies.length) {
    await new Promise((resolve, reject) => exec(
      `npm install ${dependencies.join(' ')} --save-dev`,
      {silent: true},
      code => ((0 === code) ? resolve() : reject())
    ));
  }
}
