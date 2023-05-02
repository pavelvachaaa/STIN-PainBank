import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',

    },
<<<<<<< HEAD
    testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/MockData.ts"],
=======
    //modulePathIgnorePatterns: ["<rootDir>/dist/__tests__"],
>>>>>>> main
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
}

export default jestConfig