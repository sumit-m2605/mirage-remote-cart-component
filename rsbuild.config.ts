import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  server: { port: 3002 },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'react_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './ReactComponent':   './src/components/RemoteReactComponent.tsx',
        './define-element': './src/defineElement.ts', // <-- add this line

      },
      shared: {
        react:{ singleton: true, eager: true,  requiredVersion: false },
        'react-dom':{ singleton: true, eager: true,  requiredVersion: false }
      }
    })
  ]
});
