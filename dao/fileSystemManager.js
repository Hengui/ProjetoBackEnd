const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

const getData = () => {
    if (fs.existsSync(dataPath)) {
        const jsonData = fs.readFileSync(dataPath);
        return JSON.parse(jsonData);
    }
    return [];
};

const saveData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

module.exports = {
    getData,
    saveData,
};
