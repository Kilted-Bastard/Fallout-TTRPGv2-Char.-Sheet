document.addEventListener('DOMContentLoaded', function() {
    function fetchData(url, callback) {
        fetch(url)
            .then(function(response) { return response.json(); })
            .then(function(data) { callback(data); })
            .catch(function(error) { console.error('Error:', error); });
    }

    fetchData('../json_data/backgrounds.json', function(data) {
        populateDropdown('background', data);
    });

    fetchData('../json_data/races.json', function(data) {
        populateDropdown('race', data);
    });

    fetchData('../json_data/perks.json', function(data) {
        populateDropdown('perks', data);
    });

    fetchData('../json_data/traits.json', function(data) {
        populateDropdown('traits', data);
    });

    fetchData('../json_data/armor.json', function(data) {
        populateDropdown('armor', data);
    });

    fetchData('../json_data/melee_weapons.json', function(data) {
        populateDropdown('melee_weapons', data);
    });

    fetchData('../json_data/ranged_weapons.json', function(data) {
        populateDropdown('ranged_weapons', data);
    });

    fetchData('../json_data/explosives.json', function(data) {
        populateDropdown('explosives', data);
    });

    fetchData('../json_data/ammo.json', function(data) {
        populateDropdown('ammo', data);
    });

    fetchData('../json_data/robot_weapons.json', function(data) {
        populateDropdown('robot_weapons', data);
    });

    fetchData('../json_data/special_properties.json', function(data) {
        populateDropdown('special_properties', data);
    });

    fetchData('../json_data/special_ammo.json', function(data) {
        populateDropdown('special_ammo', data);
    });

    fetchData('../json_data/melee_mods.json', function(data) {
        populateDropdown('melee_mods', data);
    });

    fetchData('../json_data/ranged_mods.json', function(data) {
        populateDropdown('ranged_mods', data);
    });

    fetchData('../json_data/ranged_special_properties.json', function(data) {
        populateDropdown('ranged_special_properties', data);
    });

    function populateDropdown(id, data) {
        var dropdown = document.getElementById(id);
        data.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            dropdown.appendChild(option);
        });
    }

    document.getElementById('toggleDarkModeButton').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    document.getElementById('saveCharacterButton').addEventListener('click', saveCharacter);
    document.getElementById('loadCharacterButton').addEventListener('click', loadCharacter);
    document.getElementById('printSheetButton').addEventListener('click', printSheet);
    document.getElementById('wildWasteland').addEventListener('click', toggleWildWasteland);

    function saveCharacter() {
        var character = {
            characterName: document.getElementById('character-name').value,
            playerName: document.getElementById('player-name').value,
            background: document.getElementById('background').value,
            race: document.getElementById('race').value,
            level: document.getElementById('level').value,
            xp: document.getElementById('xp').value,
            karmaCaps: document.getElementById('karma-caps').value,
            stats: {
                strength: document.getElementById('strength').value,
                perception: document.getElementById('perception').value,
                endurance: document.getElementById('endurance').value,
                charisma: document.getElementById('charisma').value,
                intelligence: document.getElementById('intelligence').value,
                agility: document.getElementById('agility').value,
                luck: document.getElementById('luck').value
            },
            skills: {
                barter: document.getElementById('barter').value,
                energyWeapons: document.getElementById('energyWeapons').value,
                explosives: document.getElementById('explosives').value,
                lockpick: document.getElementById('lockpick').value,
                medicine: document.getElementById('medicine').value,
                meleeWeapons: document.getElementById('meleeWeapons').value,
                repair: document.getElementById('repair').value,
                science: document.getElementById('science').value,
                smallGuns: document.getElementById('smallGuns').value,
                sneak: document.getElementById('sneak').value,
                speech: document.getElementById('speech').value,
                survival: document.getElementById('survival').value,
                unarmed: document.getElementById('unarmed').value
            },
            status: {
                hunger: getCheckedLevels('hunger'),
                dehydration: getCheckedLevels('dehydration'),
                radiation: getCheckedLevels('radiation'),
                exhaustion: getCheckedLevels('exhaustion'),
                fatigue: getCheckedLevels('fatigue'),
                penalty: document.getElementById('penalty').value,
                currentConditions: document.getElementById('currentConditions').value
            }
        };
        localStorage.setItem('character', JSON.stringify(character));
    }

    function loadCharacter() {
        var character = JSON.parse(localStorage.getItem('character'));
        if (!character) return;

        document.getElementById('character-name').value = character.characterName;
        document.getElementById('player-name').value = character.playerName;
        document.getElementById('background').value = character.background;
        document.getElementById('race').value = character.race;
        document.getElementById('level').value = character.level;
        document.getElementById('xp').value = character.xp;
        document.getElementById('karma-caps').value = character.karmaCaps;

        document.getElementById('strength').value = character.stats.strength;
        document.getElementById('perception').value = character.stats.perception;
        document.getElementById('endurance').value = character.stats.endurance;
        document.getElementById('charisma').value = character.stats.charisma;
        document.getElementById('intelligence').value = character.stats.intelligence;
        document.getElementById('agility').value = character.stats.agility;
        document.getElementById('luck').value = character.stats.luck;

        document.getElementById('barter').value = character.skills.barter;
        document.getElementById('energyWeapons').value = character.skills.energyWeapons;
        document.getElementById('explosives').value = character.skills.explosives;
        document.getElementById('lockpick').value = character.skills.lockpick;
        document.getElementById('medicine').value = character.skills.medicine;
        document.getElementById('meleeWeapons').value = character.skills.meleeWeapons;
        document.getElementById('repair').value = character.skills.repair;
        document.getElementById('science').value = character.skills.science;
        document.getElementById('smallGuns').value = character.skills.smallGuns;
        document.getElementById('sneak').value = character.skills.sneak;
        document.getElementById('speech').value = character.skills.speech;
        document.getElementById('survival').value = character.skills.survival;
        document.getElementById('unarmed').value = character.skills.unarmed;

        setCheckedLevels('hunger', character.status.hunger);
        setCheckedLevels('dehydration', character.status.dehydration);
        setCheckedLevels('radiation', character.status.radiation);
        setCheckedLevels('exhaustion', character.status.exhaustion);
        setCheckedLevels('fatigue', character.status.fatigue);
        document.getElementById('penalty').value = character.status.penalty;
        document.getElementById('currentConditions').value = character.status.currentConditions;
    }

    function getCheckedLevels(name) {
        var levels = [];
        for (var i = 1; i <= 5; i++) {
            levels.push(document.getElementById(name + i).checked);
        }
        return levels;
    }

    function setCheckedLevels(name, levels) {
        for (var i = 1; i <= 5; i++) {
            document.getElementById(name + i).checked = levels[i - 1];
        }
    }

    function printSheet() {
        window.print();
    }

    function checkLevelUp() {
        // Implement level-up logic here
    }

    function toggleWildWasteland() {
        // Implement Wild Wasteland toggle logic here
    }

    function increaseStat(stat) {
        var input = document.getElementById(stat);
        input.value = parseInt(input.value) + 1;
        // Implement additional stat increase logic if needed
    }

    function decreaseStat(stat) {
        var input = document.getElementById(stat);
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
            // Implement additional stat decrease logic if needed
        }
    }

    function calculateSkills() {
        // Implement skill calculation logic here
    }

    function calculatePenalty() {
        // Implement penalty calculation logic here
    }

    function addCondition() {
        // Implement adding a condition logic here
    }
});
