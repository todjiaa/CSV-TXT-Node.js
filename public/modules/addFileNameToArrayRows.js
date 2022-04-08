export const addFileNameToArrayRows = (fileName, method, row) => {
    row[method](fileName);
}