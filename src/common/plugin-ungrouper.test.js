import any from '@travi/any';
import {describe, it, expect} from 'vitest';

import ungroupPlugins from './plugin-ungrouper.js';

describe('plugin ungrouper', () => {
  it('should ungroup a grouped map of plugins', () => {
    const groupedPlugins = any.objectWithKeys(any.listOf(any.word), {factory: any.simpleObject});
    const ungroupedPlugins = Object.values(groupedPlugins)
      .reduce((acc, pluginGroup) => ({...acc, ...pluginGroup}), {});

    expect(ungroupPlugins(groupedPlugins)).toEqual(ungroupedPlugins);
  });
});
