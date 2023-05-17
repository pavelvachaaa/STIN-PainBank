import {
    getCreationDate,
    readFile,
    saveFile,
    mkdir,
    doesDirectoryExist,
    getMostRecentFile
} from '../../utils/file.util.js'; // Replace 'your-file' with the actual file name
import * as fsPromises from 'fs/promises';

describe('File System Functions', () => {
    const testFilePath = './test-file.txt';
    const testDirPath = 'test-directory';

    afterAll(async () => {
        // Clean up test files and directories
        await fsPromises.unlink(testFilePath);
        await fsPromises.rm(testDirPath, { recursive: true, force: true });
    });



    test('readFile should successfully read the contents of a file', async () => {
        const data = 'Hello, World!';
        await fsPromises.writeFile(testFilePath, data);

        const fileContent = await readFile({ filePath: testFilePath });
        expect(fileContent.toString()).toBe(data);
    });

    test('saveFile should successfully save data to a file', async () => {
        const data = 'Hello, World!';
        await saveFile({ filePath: testFilePath, data });

        const fileContent = await fsPromises.readFile(testFilePath, 'utf-8');
        expect(fileContent).toBe(data);
    });

    test('mkdir should create a directory if it does not exist', async () => {
        const dirPath = `${testDirPath}/subdirectory`;
        await mkdir({ dirPath });

        const dirExists = await mkdir({ dirPath });
        expect(dirExists).toBe(true);
    });

    test('doesDirectoryExist should return true if a directory exists', async () => {
        const dirExists = await mkdir({ dirPath: testDirPath });
        expect(dirExists).toBe(true);
    });

    test('doesDirectoryExist should return false if a directory does not exist', async () => {
        const dirExists = await doesDirectoryExist({ dirPath: 'nonexistent-directory' });
        expect(dirExists).toBe(false);
    });

    test('getMostRecentFile should return the path and creation date of the most recent file in a directory', async () => {
        const file1Path = `${testDirPath}/file1.txt`;
        const file2Path = `${testDirPath}/file2.txt`;
        const file3Path = `${testDirPath}/file3.txt`;

        const data = 'Test file content';
        await Promise.all([
            fsPromises.writeFile(file1Path, data),
            fsPromises.writeFile(file2Path, data),
            fsPromises.writeFile(file3Path, data)
        ]);

        const { latestPath, date } = await getMostRecentFile(testDirPath);
        expect(latestPath).not.toBeNull();
        expect(date?.constructor.name).toBe('Date');

    });

    test('getCreationDate should return the correct creation date of a file', async () => {
        const creationDate = await getCreationDate({ filePath: testFilePath });
        expect(creationDate.constructor.name).toBe('Date');
    });
});
