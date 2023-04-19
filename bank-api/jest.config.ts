import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',

    },
    //modulePathIgnorePatterns: ["<rootDir>/dist/__tests__"],
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