import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { dependencies } from "./package.json";
export default defineConfig({
  server: { port: 3002 },
  output: {
    // assetPrefix: 'https://mirage-remote-cart-component.onrender.com/',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'reactRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './define-element': './src/defineElement.ts',
        './ReactComponent': './src/components/RemoteReactComponent.tsx',
        './CartSettingsRemote': './src/components/RemoteCartSettingsComponent.tsx',
        './CartSettingsRemoteNovus': './src/components/RemoteCartSettingsComponentNovus.tsx',
        './RobotsTxtRemote': './src/components/RemoteRobotsTxtComponent.tsx',
        './CustomMetaTagsRemote': './src/components/RemoteMetaTagsComponent.tsx',
        './CanonicalTagRemote': './src/components/RemoteCanonicalComponent.tsx',
        './SitemapRemote': './src/components/RemoteSiteMapComponent.tsx',
        './SEODetailsRemote': './src/components/RemoteDetailsComponent.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true,
        },
      },
    })
  ]
});
