// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import synpressPlugins from '@synthetixio/synpress/plugins';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pluginsConfig = (on, config) => {
  synpressPlugins(on, config);
};

export default pluginsConfig;
