import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()] as any,
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.ts',
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                'dist/',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@components': path.resolve(__dirname, './src/presentation/components'),
            '@pages': path.resolve(__dirname, './src/presentation/pages'),
            '@store': path.resolve(__dirname, './src/core/store'),
            '@utils': path.resolve(__dirname, './src/core/utils'),
            '@assets': path.resolve(__dirname, './src/core/assets'),
            '@hooks': path.resolve(__dirname, './src/core/hooks'),
            '@type': path.resolve(__dirname, './src/core/types'),
            '@services': path.resolve(__dirname, './src/data/services'),
            '@repositories': path.resolve(__dirname, './src/data/repositories'),
            '@adapters': path.resolve(__dirname, './src/data/adapters'),
            '@validation': path.resolve(__dirname, './src/core/validation'),
            '@data': path.resolve(__dirname, './src/data'),
            '@domain': path.resolve(__dirname, './src/domain'),
            '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
            '@application': path.resolve(__dirname, './src/application'),
        },
    },
});
