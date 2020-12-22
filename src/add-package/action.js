import {scaffold} from '@form8ion/add-package-to-monorepo';
import {defineScaffoldJavascriptOptions} from '../common/javascript-options';

export default function (decisions) {
  return scaffold(defineScaffoldJavascriptOptions(decisions));
}
