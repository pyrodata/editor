const config = {
    compilationOptions: {
        preferredConfigPath: './tsconfig.json',
    },
    entries: [
        {
            filePath: "./src/index.ts",
            outFile: "./build/dist/index.d.ts",
            noCheck: false,
        },
        {
            filePath: "./src/components/index.ts",
            outFile: "./build/dist/components/index.d.ts",
            noCheck: false,
        },
    ],
}

module.exports = config;