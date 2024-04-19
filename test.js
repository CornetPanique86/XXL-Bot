const fs = require('fs');
const path = require('path');


const musicPath = path.join(__dirname, "music");
const allMusic = getFilesFromDir(musicPath);
let notPlayed = [...allMusic];


function getFilesFromDir(dir) {
    let files = [];

    // Read contents of the directory
    const dirContents = fs.readdirSync(dir);

    // Iterate through directory contents
    for (const item of dirContents) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        // If it's a directory, recursively call the function
        if (stat.isDirectory()) {
            files = files.concat(getFilesFromDir(itemPath));
        } else {
            // If it's a file, push its metadata to the array
			const ext = path.extname(item);
            if (ext === '.ogg') {
            	const fileName = path.parse(item).name;
            	const artist = path.basename(dir);
            	files.push({ title: fileName, artist: artist });
			}
        }
    }

    return files;
}

function getRandomAudio() {
	if (notPlayed.length === 0) notPlayed = [...allMusic];
    // Generate a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * notPlayed.length);
    // Return the randomly selected audio object
    return notPlayed[randomIndex];
}

function playRandomMusic() {
	const music = getRandomAudio();
	module.exports.nowplaying = music;
	notPlayed.splice(notPlayed.indexOf(music), 1); // Remove the music from array
	console.log(music);
	console.log(notPlayed.length);
}

setInterval(() => {
    playRandomMusic()
}, 1_500);