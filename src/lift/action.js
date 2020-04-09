import {lift} from '@form8ion/lift';
import {scaffold as scaffoldRenovate} from '@form8ion/renovate-scaffolder';

export default function () {
  return lift({scaffolders: {Renovate: scaffoldRenovate}});
}
