import { noEmptyStrings } from "./noEmptyStrings.js";

// Convert the txt files from strings to arrays
// export const convertTxtFilesToArray = (txt) => {
//     return [
//         txt.split("\n")
//         .map(row => row
//         .split(" ")
//         .filter(noEmptyStrings))
//     ];
// }

export const convertTxtFilesToArray = (txt, fileName) => {
    const array = txt.split("\r\n").map(row => row.split(" ").filter(noEmptyStrings));

    array.forEach(row => {
        row.push(fileName);
    })

    return [array];
}