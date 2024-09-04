export default function (groupedPlugins) {
  return Object.values(groupedPlugins).reduce((acc, pluginGroup) => ({...acc, ...pluginGroup}), {});
}
