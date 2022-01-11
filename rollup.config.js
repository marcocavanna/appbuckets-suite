import { defineConfig } from 'rollup';

import glob from 'fast-glob';

import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

import getExternalsDependenciesFromPackage from './scripts/getExternalsDependenciesFromPackage';


export default defineConfig({

  external: getExternalsDependenciesFromPackage(),

  input: glob.sync('src/**/index.ts'),

  output: [
    {
      exports        : 'auto',
      dir            : 'build',
      format         : 'cjs',
      preserveModules: true
    }, {
      exports        : 'auto',
      dir            : 'build/esm',
      format         : 'esm',
      preserveModules: true
    }
  ],


  plugins: [
    peerDepsExternal({
      deps    : true,
      peerDeps: true
    }),
    typescript({
      useTsconfigDeclarationDir: true
    }),
    commonjs(),
    optimizeLodashImports()
  ]

});
