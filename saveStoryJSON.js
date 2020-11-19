const fs = require('fs');

function saveStoryJSON(story) {
    fs.writeFile('./JSON/JSONStory.json', JSON.stringify(story), err => err ? console.log(err) : null);
    
    
}



module.exports = saveStoryJSON;