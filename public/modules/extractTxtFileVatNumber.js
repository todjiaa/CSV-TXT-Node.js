export const extractTxtFileVatNumber = (txtArray) => {
    txtArray.forEach(row => {
        const vatNumberCell = row[4];

        if (!vatNumberCell) return;

        row[4] = vatNumberCell.split("").slice(10).join("");
    })
}