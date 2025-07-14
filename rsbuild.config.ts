import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { dependencies } from "./package.json";
export default defineConfig({
  server: { port: 3002 },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'reactRemote',
      filename: 'remoteEntry.js',
      exposes: {
        './define-element': './src/defineElement.ts',
        './ReactComponent': './src/components/RemoteReactComponent.tsx',
        './CartSettingsRemote': './src/components/RemoteCartSettingsComponent.tsx',
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
