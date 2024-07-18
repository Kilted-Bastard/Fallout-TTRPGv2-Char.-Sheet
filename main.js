// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.toggle('dark-mode'));
}

// Save Character
function saveCharacter() {
    const characterName = prompt('Enter a name for this character sheet:', '');
    if (characterName) {
        const characterData = {
            characterName: document.getElementById('characterName').value,
            playerName: document.getElementById('playerName').value,
            karmaCaps: document.getElementById('karmaCaps').value,
            race: document.getElementById('race').value,
            subrace: document.getElementById('subrace').value,
            background: document.getElementById('background').value,
            xp: document.getElementById('xp').value,
            level: document.getElementById('level').value,
            strength: document.getElementById('strength').value,
            perception: document.getElementById('perception').value,
            endurance: document.getElementById('endurance').value,
            charisma: document.getElementById('charisma').value,
            intelligence: document.getElementById('intelligence').value,
            agility: document.getElementById('agility').value,
            luck: document.getElementById('luck').value,
            skills: getSkillsData(),
            status: getStatusData()
        };
        localStorage.setItem(characterName, JSON.stringify(characterData));
        alert('Character saved!');
    }
}

// Load Character
function loadCharacter() {
    const characterName = prompt('Enter the name of the character sheet to load:', '');
    if (characterName) {
        const characterData = JSON.parse(localStorage.getItem(characterName));
        if (characterData) {
            document.getElementById('characterName').value = characterData.characterName;
            document.getElementById('playerName').value = characterData.playerName;
            document.getElementById('karmaCaps').value = characterData.karmaCaps;
            document.getElementById('race').value = characterData.race;
            document.getElementById('subrace').value = characterData.subrace;
            document.getElementById('background').value = characterData.background;
            document.getElementById('xp').value = characterData.xp;
            document.getElementById('level').value = characterData.level;
            document.getElementById('strength').value = characterData.strength;
            document.getElementById('perception').value = characterData.perception;
            document.getElementById('endurance').value = characterData.endurance;
            document.getElementById('charisma').value = characterData.charisma;
            document.getElementById('intelligence').value = characterData.intelligence;
            document.getElementById('agility').value = characterData.agility;
            document.getElementById('luck').value = characterData.luck;
            setSkillsData(characterData.skills);
            setStatusData(characterData.status);
            calculateModifiers();
            alert('Character loaded!');
        } else {
            alert('No character data found for that name.');
        }
    }
}

// Print Sheet
function printSheet() {
    window.print();
}

// Reset Sheet
function resetSheet() {
    if (confirm('Are you sure you want to reset the sheet? This will clear all data and return to default values.')) {
        document.getElementById('characterName').value = '';
        document.getElementById('playerName').value = '';
        document.getElementById('karmaCaps').value = '1';
        document.getElementById('race').selectedIndex = 0;
        document.getElementById('subrace').selectedIndex = 0;
        document.getElementById('background').selectedIndex = 0;
        document.getElementById('xp').value = '';
        document.getElementById('level').value = '';
        const stats = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
        stats.forEach(stat => {
            document.getElementById(stat).value = '5';
        });
        calculateModifiers();
        const skills = ['barter', 'breach', 'crafting', 'energyWeapons', 'explosives', 'guns', 'intimidation', 'medicine', 'meleeWeapons', 'science', 'sneak', 'speech', 'survival', 'unarmed'];
        skills.forEach(skill => {
            document.getElementById(skill + 'Tagged').checked = false;
            document.getElementById(skill).value = '';
        });
        const statuses = ['hunger', 'dehydration', 'exhaustion', 'radiation', 'fatigue'];
        statuses.forEach(status => {
            for (let i = 1; i <= 10; i++) {
                if (status !== 'fatigue' || (status === 'fatigue' && i <= 9)) {
                    document.getElementById(status + i).checked = false;
                }
            }
        });
        document.getElementById('currentConditions').value = '';
        document.getElementById('penalty').value = '';
    }
}

// Toggle Wild Wasteland
function toggleWildWasteland() {
    const isChecked = document.getElementById('wildWasteland').checked;
    console.log('Wild Wasteland:', isChecked);
}

// Check Level Up
function checkLevelUp() {
    const xp = parseInt(document.getElementById('xp').value, 10);
    const level = Math.floor(xp / 1000);
    document.getElementById('level').value = level;
}

// Increase Stat
function increaseStat(stat) {
    const statElement = document.getElementById(stat);
    let value = parseInt(statElement.value, 10);
    value++;
    statElement.value = value;
    calculateModifiers();
}

// Decrease Stat
function decreaseStat(stat) {
    const statElement = document.getElementById(stat);
    let value = parseInt(statElement.value, 10);
    if (value > 1) {
        value--;
        statElement.value = value;
        calculateModifiers();
    }
}

// Calculate Modifiers
function calculateModifiers() {
    const stats = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
    stats.forEach(stat => {
        const value = parseInt(document.getElementById(stat).value, 10);
        const modifier = value - 5;
        document.getElementById(stat + 'Modifier').value = modifier;
    });
    calculateSkills();
    calculatePenalty();
}

// Calculate Skills
function calculateSkills() {
    const skills = [
        'barter', 'breach', 'crafting', 'energyWeapons', 'explosives', 'guns',
        'intimidation', 'medicine', 'meleeWeapons', 'science', 'sneak', 'speech',
        'survival', 'unarmed'
    ];
    skills.forEach(skill => {
        const tagged = document.getElementById(skill + 'Tagged').checked;
        const skillElement = document.getElementById(skill);
        const baseValue = getBaseSkillValue(skill);
        const modifier = tagged ? baseValue + 2 : baseValue;
        skillElement.value = modifier;
    });
}

// Get base skill value based on SPECIAL stats
function getBaseSkillValue(skill) {
    switch (skill) {
        case 'barter':
            return parseInt(document.getElementById('charismaModifier').value, 10);
        case 'breach':
            return Math.max(parseInt(document.getElementById('perceptionModifier').value, 10), parseInt(document.getElementById('intelligenceModifier').value, 10));
        case 'crafting':
            return parseInt(document.getElementById('intelligenceModifier').value, 10);
        case 'energyWeapons':
            return parseInt(document.getElementById('perceptionModifier').value, 10);
        case 'explosives':
            return parseInt(document.getElementById('perceptionModifier').value, 10);
        case 'guns':
            return parseInt(document.getElementById('agilityModifier').value, 10);
        case 'intimidation':
            return Math.max(parseInt(document.getElementById('strengthModifier').value, 10), parseInt(document.getElementById('charismaModifier').value, 10));
        case 'medicine':
            return Math.max(parseInt(document.getElementById('perceptionModifier').value, 10), parseInt(document.getElementById('intelligenceModifier').value, 10));
        case 'meleeWeapons':
            return parseInt(document.getElementById('strengthModifier').value, 10);
        case 'science':
            return parseInt(document.getElementById('intelligenceModifier').value, 10);
        case 'sneak':
            return parseInt(document.getElementById('agilityModifier').value, 10);
        case 'speech':
            return parseInt(document.getElementById('charismaModifier').value, 10);
        case 'survival':
            return parseInt(document.getElementById('enduranceModifier').value, 10);
        case 'unarmed':
            return parseInt(document.getElementById('strengthModifier').value, 10);
        default:
            return 0;
    }
}

// Get Skills Data
function getSkillsData() {
    const skills = [
        'barter', 'breach', 'crafting', 'energyWeapons', 'explosives', 'guns',
        'intimidation', 'medicine', 'meleeWeapons', 'science', 'sneak', 'speech',
        'survival', 'unarmed'
    ];
    const skillsData = {};
    skills.forEach(skill => {
        skillsData[skill] = {
            tagged: document.getElementById(skill + 'Tagged').checked,
            value: document.getElementById(skill).value
        };
    });
    return skillsData;
}

// Set Skills Data
function setSkillsData(skillsData) {
    Object.keys(skillsData).forEach(skill => {
        document.getElementById(skill + 'Tagged').checked = skillsData[skill].tagged;
        document.getElementById(skill).value = skillsData[skill].value;
    });
}

// Get Status Data
function getStatusData() {
    const statuses = ['hunger', 'dehydration', 'exhaustion', 'radiation', 'fatigue'];
    const statusData = {};
    statuses.forEach(status => {
        const statusChecks = [];
        for (let i = 1; i <= 10; i++) {
            if (status !== 'fatigue' || (status === 'fatigue' && i <= 9)) {
                statusChecks.push(document.getElementById(status + i).checked);
            }
        }
        statusData[status] = statusChecks;
    });
    statusData.currentConditions = document.getElementById('currentConditions').value;
    return statusData;
}

// Set Status Data
function setStatusData(statusData) {
    Object.keys(statusData).forEach(status => {
        if (status !== 'currentConditions') {
            statusData[status].forEach((checked, index) => {
                if (status !== 'fatigue' || (status === 'fatigue' && index <= 8)) {
                    document.getElementById(status + (index + 1)).checked = checked;
                }
            });
        } else {
            document.getElementById('currentConditions').value = statusData[status];
        }
    });
}

// Calculate Status Penalty
function calculatePenalty() {
    const statuses = ['hunger', 'dehydration', 'exhaustion', 'radiation', 'fatigue'];
    let penalty = 0;
    statuses.forEach(status => {
        for (let i = 1; i <= 10; i++) {
            if (status !== 'fatigue' || (status === 'fatigue' && i <= 9)) {
                if (document.getElementById(status + i).checked) {
                    penalty -= 1;
                }
            }
        }
    });
    document.getElementById('penalty').value = penalty;
}

// Add Condition
function addCondition() {
    const condition = prompt('Enter the condition description:');
    if (condition) {
        const currentConditions = document.getElementById('currentConditions');
        currentConditions.value += (currentConditions.value ? '\n' : '') + condition;
    }
}

// Populate Subrace Dropdown
function populateSubraceDropdown(race) {
    const subraceSelect = document.getElementById('subrace');
    subraceSelect.innerHTML = '';
    const subraces = raceData[race] || [];
    console.log('Subraces for', race, ':', subraces); // Debug output
    subraces.forEach(subrace => {
        const option = document.createElement('option');
        option.value = subrace.name;
        option.textContent = subrace.name;
        subraceSelect.appendChild(option);
    });
}

// Update Race Modifiers
function updateRaceModifiers(race, subrace) {
    const raceInfo = raceData[race].find(sub => sub.name === subrace);
    if (raceInfo) {
        const stats = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
        stats.forEach(stat => {
            if (raceInfo[stat]) {
                document.getElementById(stat).value = raceInfo[stat];
            }
        });

        const traitsSection = document.getElementById('traits');
        traitsSection.innerHTML = '';
        if (raceInfo.traits) {
            raceInfo.traits.forEach(trait => {
                const traitElement = document.createElement('div');
                traitElement.textContent = `${trait.name}: ${trait.description}`;
                traitsSection.appendChild(traitElement);
            });
        }
    }
}

// Initialize the page with default values and event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetch('races.json')
        .then(response => response.json())
        .then(data => {
            window.raceData = data;
            console.log('Race data fetched:', data); // Debug output
            const races = Object.keys(data);
            const raceSelect = document.getElementById('race');
            races.forEach(race => {
                const option = document.createElement('option');
                option.value = race;
                option.textContent = race;
                raceSelect.appendChild(option);
            });
            populateSubraceDropdown(raceSelect.value);
        })
        .catch(error => console.error('Error fetching race data:', error));

    const backgrounds = ['Wastelander', 'Vault Dweller', 'Raider', 'Merchant', 'Scientist'];
    const backgroundSelect = document.getElementById('background');
    backgrounds.forEach(background => {
        const option = document.createElement('option');
        option.value = background;
        option.textContent = background;
        backgroundSelect.appendChild(option);
    });

    document.getElementById('race').addEventListener('change', (event) => {
        populateSubraceDropdown(event.target.value);
        updateRaceModifiers(event.target.value, document.getElementById('subrace').value);
    });

    document.getElementById('subrace').addEventListener('change', (event) => {
        updateRaceModifiers(document.getElementById('race').value, event.target.value);
    });

    calculateModifiers();
});
