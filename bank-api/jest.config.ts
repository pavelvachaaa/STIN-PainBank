import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',

    },
    testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/MockData.ts", "__tests__/services/account.service.test.ts"],
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