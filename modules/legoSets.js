// modules/legoSets.js

const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

let sets = [];

// Initialize function to populate the sets array
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(set => {
                const theme = themeData.find(theme => theme.id === set.theme_id);
                return {
                    ...set,
                    theme: theme ? theme.name : 'Unknown Theme'
                };
            });
            resolve();
        } catch (error) {
            reject("Initialization failed: " + error.message); //display the error message
        }
    });
}

// Function to get all sets
function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No sets available.");
        }
    });
}

// Function to get a set by its number
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(set => set.set_num === setNum);
        if (set) {
            resolve(set);
        } else {
            reject("Set not found.");
        }
    });
}

// Function to get sets by theme
function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const themeLowerCase = theme.toLowerCase();
        const filteredSets = sets.filter(set => set.theme.toLowerCase().includes(themeLowerCase));
        if (filteredSets.length > 0) {
            resolve(filteredSets);
        } else {
            reject("No sets found for the given theme.");
        }
    });
}

//export the functions as a module
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }



