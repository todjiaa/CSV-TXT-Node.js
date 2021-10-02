// Convert the csv files from strings to arrays and add the name of the original file at the end of each row
export const convertCsvFilesToArray = (csv, fileName) => {
    const array = csv.split("\n").map(row => row.split(";"))

    // array.unshift(["Start"])
    array.push(["End"])

    array.forEach(row => {
        row.push(fileName);
    })

    return [array]
}