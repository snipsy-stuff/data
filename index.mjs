import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const rootDir = './spells'; // Change this to your target folder
const index = {};
const newPath = './docs/';

function walk(dir) {


    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            walk(fullPath); // Recurse into subdirectory
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            /**
             * @type {import('@snipsy-stuff/pf-data').CustomSpell[]}
             */
            const data = JSON.parse(readFileSync(fullPath, 'utf-8'));
            for (const spell of data) {
                const tosave = `./docs/${spell.class.toLowerCase()}/${spell.name.replace('/', '-')}.md`;
                const comps = Array.isArray(spell.spellcomp)
                    ? `**Components**: ${spell.spellcomp.map((sp) => sp).join(', ')}`
                    : `**Component**:${spell.spellcomp}` || '';
                const markdown = `
# Spell: ${spell.name}
**Class**: ${spell.class}  
**Level**: ${spell.level}  
**Casting Time**: ${spell.casttime}  
**Range**: ${spell.range}  
**Target**: ${spell.target || "_None_"}  
**Area**: ${spell.area}  
**Effect**: ${spell.effect || "_None_"}  
**Duration**: ${spell.duration}  
**Saving Throw**: ${spell.savetext} (${spell.save})  
**Spell Resistance**: ${spell.resisttext} (${spell.resist})  
**DC**: ${spell.dc}  
**Caster Level**: ${spell.casterlevel}  
**Spontaneous**: ${spell.spontaneous === "yes" ? "Yes" : "No"}

---

### 🔮 Components
- ${comps}

### 🏫 School
- ** School **: ${spell.spellschool}
- ** Subschool **: ${spell.spellsubschool}
- ** Descriptor **: ${spell.spelldescript}
---

### 📜 Description
${spell.description}
`;
                console.log(`creating spell ${spell.name
                    }`);
                writeFileSync(tosave, markdown);

            }
        }
    }
}

walk(rootDir);
console.log(index);;;;;
