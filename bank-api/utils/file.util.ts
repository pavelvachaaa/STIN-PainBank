import * as fsPromises from 'fs/promises';

export const getCreationDate = async ({ filePath = "" }): Promise<Date> => {
    return (await fsPromises.stat(filePath)).birthtime;
}

export const readFile = async ({ filePath = "" }) => {
    return await fsPromises.readFile("./data/currencies/new.txt")
}

export const saveFile = async ({ filePath = "", data = "" }) => {
    await fsPromises.writeFile(filePath, data);
}


