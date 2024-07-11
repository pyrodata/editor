/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import dts from 'vite-plugin-dts'
import { sync } from 'glob';

const getPackageName = () => {
    return packageJson.name;
};

const getPackageNameCamelCase = () => {
    try {
        return getPackageName().replace(/-./g, char => char[1].toUpperCase());
    } catch (err) {
        throw new Error("Name property in package.json is missing.");
    }
};

const fileName = {
    es: `editor.mjs`
}

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

export default defineConfig({
    base: "./",
    //plugins: [dts({ entryRoot: './' })],
    build: {
        outDir: "./build/dist",
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ['es'],
            fileName: format => fileName[format],
        },
        rollupOptions: {
            input: sync(path.resolve(__dirname, 'src/**/index.ts')),
            output: {
                extend: true,
                entryFileNames: (entry) => {
                    const { name, facadeModuleId } = entry;
                    const fileName = `${name}.mjs`;

                    if (!facadeModuleId) {
                        return fileName;
                    }

                    const relativeDir = path.relative(
                        path.resolve(__dirname, 'src'),
                        path.dirname(facadeModuleId),
                    );

                    return path.join(relativeDir, fileName);
                },
            }
        }
    },
    test: {},
    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(__dirname, "src") },
            { find: "@@", replacement: path.resolve(__dirname) },
        ],
    },
});
