const getUpdatedFields = (fields, model) => {
    const updatedFields = {};
    Object.keys(fields).forEach(key => {
        if (fields[key].length == 0 || fields[key] == undefined) fields[key] = null;
        if (model.hasOwnProperty(key) && model[key] != fields[key]) {
            updatedFields[key] = fields[key];
        }
    });

    return updatedFields;
}

module.exports = getUpdatedFields;