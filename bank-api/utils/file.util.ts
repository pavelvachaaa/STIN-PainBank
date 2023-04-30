import * as fsPromises from 'fs/promises';

export const getCreationDate = async ({ filePath = "" }): Promise<Date> => {
    return (await fsPromises.stat(filePath)).birthtime;
}

export const readFile = async ({ filePath = "" }) => {
    return await fsPromises.readFile(filePath)
}

export const saveFile = async ({ filePath = "", data = "" }) => {
    await fsPromises.writeFile(filePath, data);
}
export const mkdir = async ({ dirPath = "" }) => {
    const dirExists = await doesDirectoryExist({ dirPath: dirPath });
    if (dirExists) {
        return true;
    }

    await fsPromises.mkdir(dirPath, { recursive: true });

    return true;
}

export const doesDirectoryExist = async ({ dirPath = "" }): Promise<boolean> => {
    try {
        await fsPromises.access(dirPath, fsPromises.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

export const getMostRecentFile = async (path: string): Promise<{ latestPath: string | null, date: Date | null }> => {
    let latestPath: string | null = null;
    let latestMtime: Date | null = null;
    let date: Date | null = null;


    const files = await fsPromises.readdir(path);

    if (files.length > 0) {
        for (const file of files) {
            const filePath = `${path}/${file}`;
            const stats = await fsPromises.stat(filePath);

            if (!latestMtime || stats.mtime > latestMtime) {
                latestPath = filePath;
                latestMtime = stats.mtime;
            }
        }

        date = await getCreationDate({ filePath: latestPath ?? "" });
    }

    return { latestPath, date };
}

