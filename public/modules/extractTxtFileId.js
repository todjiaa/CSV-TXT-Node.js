import { txtFileIdCellNumber } from "./variablesAndFlags.js";

// Remove the automatically generated entry number at the beginning of each txt id which comes from the software that has exported the orifinal txt file
export const extractTxtFileId = (txtArray) => {
    txtArray.forEach((row, i) => {
        const id = row[txtFileIdCellNumber-1];

        if (!id) return;

        const entryNumberOne = i + 1 + "01";

        const entryNumberThree = i + 1 + "03";
        
        if (id.startsWith(entryNumberOne)) {
            row[txtFileIdCellNumber-1] = id.substring(entryNumberOne.length);

            // console.log(row[txtFileIdCellNumber-1])
        }

        if (id.startsWith(entryNumberThree)) {
            row[txtFileIdCellNumber-1] = id.substring(entryNumberThree.length);

            // console.log(row[txtFileIdCellNumber-1])
        }
    })
}