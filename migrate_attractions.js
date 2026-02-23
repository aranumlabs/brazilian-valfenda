import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('c:/Users/jaime/OneDrive/Desktop/chapada-veadeiros/legacy/data.js', 'utf-8');

// Simple regex to extract the ATTRACTIONS array content
const match = content.match(/const ATTRACTIONS = (\[[\s\S]*?\]);/);
if (match) {
    let attractionsJson = match[1];

    // The JSON in the js file is slightly different (e.g. might have unquoted keys if it wasn't valid JSON, but here it looks like valid JSON objects)
    // Actually, looking at the view_file output, it looks like standard JS objects.

    const header = "import type { Attraction } from './types';\n\nexport const ATTRACTIONS: Attraction[] = ";
    const footer = ";\n";

    writeFileSync('c:/Users/jaime/OneDrive/Desktop/chapada-veadeiros/src/data/attractions.ts', header + attractionsJson + footer);
    console.log("Attractions restored successfully.");
} else {
    console.error("Could not find ATTRACTIONS in legacy/data.js");
}
