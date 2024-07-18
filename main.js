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

// Calculate Status Penalty
function calculatePenalty() {
    const statuses = ['hunger', 'dehydration', 'exhaustion', 'radiation', 'fatigue'];
    let penalty = 0;
    statuses.forEach(status => {
        for (let i = 1; i <= 10; i++) {
            if (status !== 'fatigue' || (status === 'fatigue' && i <= 9)) {
                if (document.getElementById(status + i).checked) {
                    penalty--;
                }
            }
        }
    });
    document.getElementById('penalty').value = penalty;
}

// Fetch and populate race and subrace options
async function fetchAndPopulateRaceData() {
    try {
        const response = await fetch('races.json');
        const raceData = await response.json();

        const raceSelect = document.getElementById('race');
        const subraceSelect = document.getElementById('subrace');
        raceSelect.innerHTML = '<option value="">Select Race</option>';
        subraceSelect.innerHTML = '<option value="">Select Sub-race</option>';

        Object.keys(raceData).forEach(race => {
            const option = document.createElement('option');
            option.value = race;
            option.textContent = race;
            raceSelect.appendChild(option);
        });

        raceSelect.addEventListener('change', () => {
            const selectedRace = raceSelect.value;
            subraceSelect.innerHTML = '<option value="">Select Sub-race</option>';
            if (selectedRace && raceData[selectedRace].subraces) {
                raceData[selectedRace].subraces.forEach(subrace => {
                    const option = document.createElement('option');
                    option.value = subrace.name;
                    option.textContent = subrace.name;
                    subraceSelect.appendChild(option);
                });
            }
            updateTraits();
        });

        subraceSelect.addEventListener('change', updateTraits);
    } catch (error) {
        console.error('Error fetching race data:', error);
    }
}

// Update traits based on selected race and subrace
function updateTraits() {
    const raceSelect = document.getElementById('race');
    const subraceSelect = document.getElementById('subrace');
    const selectedRace = raceSelect.value;
    const selectedSubrace = subraceSelect.value;

    const traitsContainer = document.querySelector('.traits-section .traits-list');
    traitsContainer.innerHTML = '';

    fetch('races.json')
        .then(response => response.json())
        .then(raceData => {
            if (selectedRace && raceData[selectedRace]) {
                const raceTraits = raceData[selectedRace].traits || [];
                raceTraits.forEach(trait => {
                    const traitElement = document.createElement('div');
                    traitElement.classList.add('trait');
                    traitElement.textContent = trait;
                    traitsContainer.appendChild(traitElement);
                });

                if (selectedSubrace && raceData[selectedRace].subraces) {
                    const subrace = raceData[selectedRace].subraces.find(sub => sub.name === selectedSubrace);
                    if (subrace) {
                        const subraceTraits = subrace.traits || [];
                        subraceTraits.forEach(trait => {
                            const traitElement = document.createElement('div');
                            traitElement.classList.add('trait');
                            traitElement.textContent = trait;
                            traitsContainer.appendChild(traitElement);
                        });
                    }
                }
            }
        })
        .catch(error => console.error('Error updating traits:', error));
}

// Fetch race data on page load
window.onload = fetchAndPopulateRaceData;

// Get skills data for saving
function getSkillsData() {
    const skills = [
        'barter', 'breach', 'crafting', 'energyWeapons', 'explosives', 'guns',
        'intimidation', 'medicine', 'meleeWeapons', 'science', 'sneak', 'speech',
        'survival', 'unarmed'
    ];
    return skills.map(skill => ({
        name: skill,
        tagged: document.getElementById(skill + 'Tagged').checked,
        value: document.getElementById(skill).value
    }));
}

// Set skills data for loading
function setSkillsData(skills) {
    skills.forEach(skill => {
        document.getElementById(skill.name + 'Tagged').checked = skill.tagged;
        document.getElementById(skill.name).value = skill.value;
    });
}

// Get status data for saving
function getStatusData() {
    const statuses = ['hunger', 'dehydration', 'exhaustion', 'radiation', 'fatigue'];
    return statuses.reduce((acc, status) => {
        acc[status] = [];
        for (let i = 1; i <= 10; i++) {
            if (status !== 'fatigue' || (status === 'fatigue' && i <= 9)) {
                acc[status].push(document.getElementById(status + i).checked);
            }
        }
        return acc;
    }, {});
}

// Set status data for loading
function setStatusData(statusData) {
    Object.keys(statusData).forEach(status => {
        statusData[status].forEach((checked, index) => {
            document.getElementById(status + (index + 1)).checked = checked;
        });
    });
}
