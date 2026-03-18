import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    restoreMocks: true,
    mockReset: true,
    resetEnv: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/**/index.js']
    }
  }
});
