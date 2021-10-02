// Remove any rows in the csv array that are empty or having headers information, etc. 
// export const extractOnlyUsableMissingRows = (missingRows) => {
//     let usableRows = [];

//     for (let i = 0; i < missingRows.length; i++) {
//         const missingRowsString = missingRows[i].join('///').replace(/['"]+/g, '');
        
//         if (!missingRowsString.startsWith("BG")) continue;

//         usableRows.push(missingRowsString.split("///"));
//     }
//     return [usableRows];
// }



export const separateMissingInvoicesByFile = (missingRows) => {
    let filesArray = [];
    
    for (let i = 0; i < missingRows.length; i++) {
        if (missingRows[i][0] === "End") {
            filesArray.push(missingRows.splice(0, missingRows.indexOf(missingRows[i]) + 1));
            
            i = 0;
        }
    }
    return [filesArray];
}