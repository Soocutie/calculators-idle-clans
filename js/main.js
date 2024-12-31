// Level XP data
const levelXP = {
    1: 0, 2: 75, 3: 151, 4: 227, 5: 303, 6: 380, 7: 531, 8: 683, 9: 836, 10: 988,
    11: 1141, 12: 1294, 13: 1447, 14: 1751, 15: 2054, 16: 2358, 17: 2663, 18: 2967,
    19: 3272, 20: 3577, 21: 4182, 22: 4788, 23: 5393, 24: 5999, 25: 6606, 26: 7212,
    27: 7819, 28: 9026, 29: 10233, 30: 11441, 31: 12648, 32: 13856, 33: 15065,
    34: 16273, 35: 18682, 36: 21091, 37: 23500, 38: 25910, 39: 28319, 40: 30729,
    41: 33140, 42: 37950, 43: 42761, 44: 47572, 45: 52383, 46: 57195, 47: 62006,
    48: 66818, 49: 76431, 50: 86043, 51: 95656, 52: 105269, 53: 114882, 54: 124496,
    55: 134109, 56: 153323, 57: 172538, 58: 191752, 59: 210967, 60: 230182,
    61: 249397, 62: 268613, 63: 307028, 64: 345444, 65: 383861, 66: 422277,
    67: 460694, 68: 499111, 69: 537528, 70: 614346, 71: 691163, 72: 767981,
    73: 844800, 74: 921618, 75: 998437, 76: 1075256, 77: 1228875, 78: 1382495,
    79: 1536114, 80: 1689734, 81: 1843355, 82: 1996975, 83: 2150596, 84: 2457817,
    85: 2765038, 86: 3072260, 87: 3379481, 88: 3686703, 89: 3993926, 90: 4301148,
    91: 4915571, 92: 5529994, 93: 6144417, 94: 6758841, 95: 7373264, 96: 7987688,
    97: 8602113, 98: 9830937, 99: 11059762, 100: 12288587, 101: 13517412,
    102: 14746238, 103: 15975063, 104: 17203889, 105: 19661516, 106: 22119142,
    107: 24576769, 108: 27034396, 109: 29492023, 110: 31949651, 111: 34407278,
    112: 39322506, 113: 44237735, 114: 49152963, 115: 54068192, 116: 58983421,
    117: 63898650, 118: 68813880, 119: 78644309, 120: 88474739
};

let calculationHistory = [];
let levelCalculationHistory = [];
let lastCalculatedResults = [];

function safelyGetFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function safelySetToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        showNotification('Error saving data');
        return false;
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    safelySetToStorage('sidebarOpen', sidebar.classList.contains('active'));
}

function switchTab(tabIndex) {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.calculator-content');
    
    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    contents.forEach((content, index) => {
        if (index === tabIndex) {
            content.classList.add('active');
            content.style.display = 'block';
        } else {
            content.classList.remove('active');
            content.style.display = 'none';
        }
    });

    safelySetToStorage('activeCalculatorTab', tabIndex);
}

// Function to toggle floating animation
function toggleAnimation() {
    const container = document.querySelector('.container');
    const isAnimationEnabled = document.getElementById('animation-toggle').checked;

    if (isAnimationEnabled) {
        container.classList.add('floating');
    } else {
        container.classList.remove('floating');
    }

    safelySetToStorage('animationEnabled', isAnimationEnabled);
}

// Load animation preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const isAnimationEnabled = safelyGetFromStorage('animationEnabled');
    if (isAnimationEnabled === false) {
        document.getElementById('animation-toggle').checked = false;
        document.querySelector('.container').classList.remove('floating');
    } else {
        document.querySelector('.container').classList.add('floating');
    }
});

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-toggle i');
    
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    safelySetToStorage('theme', body.classList.contains('light-mode'));
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Time Calculator Functions
function formatTime(totalSeconds) {
    const format = document.getElementById('timeFormat').value;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    switch(format) {
        case 'compact':
            return `${hours}h ${minutes}m ${seconds}s`;
        case 'decimal':
            return `${(totalSeconds / 3600).toFixed(2)}h`;
        default:
            return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
    }
}

function validateNumberInput(input) {
    const regex = /^\d+$|^\d+[.,]\d+$/;
    return regex.test(input.trim());
}

// Update the validateSecondsInput function to use the same validation
function validateSecondsInput(input) {
    // Use the same validation as validateNumberInput
    return validateNumberInput(input);
}

// Update the calculate function to handle both separators
function calculate(e) {
    if (e) e.preventDefault();
    
    try {
        const amount = parseFloat(document.getElementById('kogus').value);
        const secondsInput = document.getElementById('aeg').value;

        // Validate the seconds input format
        if (!validateSecondsInput(secondsInput)) {
            showNotification('Please enter a valid number (e.g., 5 or 5.3 or 5,3)');
            return false;
        }

        // Convert the input string to a number, replacing comma with dot
        const secondsPerItem = parseFloat(secondsInput.replace(',', '.'));

        if (isNaN(amount) || amount <= 0 || isNaN(secondsPerItem) || secondsPerItem <= 0) {
            showNotification('Please enter valid positive numbers');
            return false;
        }

        const totalSeconds = amount * secondsPerItem;
        const result = formatTime(totalSeconds);
        
        document.getElementById('result').value = result;

        const calculation = {
            amount,
            secondsPerItem: secondsInput, // Store the original input with comma
            result,
            timestamp: new Date().toISOString()
        };
        calculationHistory.unshift(calculation);
        if (calculationHistory.length > 10) {
            calculationHistory = calculationHistory.slice(0, 10);
        }
        updateHistoryList();
        saveHistory();
        showNotification('Calculation completed!');
    } catch (error) {
        showNotification('Error during calculation');
    }
    return false;
}

function updateHistoryList() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    calculationHistory.forEach((calc) => {
        const li = document.createElement('li');
        li.innerHTML = `${calc.amount} × ${calc.secondsPerItem}s = ${calc.result}`;
        li.onclick = () => {
            navigator.clipboard.writeText(calc.result)
                .then(() => showNotification('Result copied!'));
        };
        historyList.appendChild(li);
    });
}

function resetForm() {
    document.getElementById('calculator-form').reset();
    document.getElementById('result').value = '';
    showNotification('Form reset');
}

function clearHistory() {
    calculationHistory = [];
    updateHistoryList();
    saveHistory();
    showNotification('History cleared');
}

function saveHistory() {
    safelySetToStorage('calculationHistory', calculationHistory);
}

function loadHistory() {
    const saved = safelyGetFromStorage('calculationHistory');
    if (saved) {
        calculationHistory = saved;
        updateHistoryList();
    }
}

// Level Calculator Functions
function updateCurrentXP() {
    const currentLevel = parseInt(document.getElementById('currentLevel').value);
    const currentXPInput = document.getElementById('currentXP');
    const goalLevelSelect = document.getElementById('goalLevel');

    if (currentLevel) {
        currentXPInput.value = levelXP[currentLevel];
        
        goalLevelSelect.innerHTML = '<option value="">Select Goal Level</option>';
        for (let level = currentLevel + 1; level <= 120; level++) {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = `Level ${level} (${levelXP[level].toLocaleString()} XP)`;
            goalLevelSelect.appendChild(option);
        }
    } else {
        currentXPInput.value = '';
        goalLevelSelect.innerHTML = '<option value="">Select Goal Level</option>';
    }

    goalLevelSelect.value = '';
}

function populateLevelSelects() {
    const currentLevelSelect = document.getElementById('currentLevel');
    
    currentLevelSelect.innerHTML = '<option value="">Select Current Level</option>';
    
    for (let level = 1; level < 120; level++) {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = `Level ${level} (${levelXP[level].toLocaleString()} XP)`;
        currentLevelSelect.appendChild(option);
    }
}

function calculateLevelGoal(e) {
    if (e) e.preventDefault();
    
    try {
        const currentLevel = parseInt(document.getElementById('currentLevel').value);
        const currentXPInput = document.getElementById('currentXP').value;
        const goalLevel = parseInt(document.getElementById('goalLevel').value);
        const xpPerActionInput = document.getElementById('xpPerAction').value;

        // Validate inputs
        if (!validateNumberInput(currentXPInput) || !validateNumberInput(xpPerActionInput)) {
            showNotification('Please enter valid numbers (e.g., 5 or 5.3 or 5,3)');
            return false;
        }

        // Convert inputs, replacing comma with dot if present
        const currentXP = parseInt(currentXPInput.replace(',', '.'));
        const xpPerAction = parseFloat(xpPerActionInput.replace(',', '.'));

        if (!currentLevel || !goalLevel || isNaN(xpPerAction) || xpPerAction <= 0 || isNaN(currentXP)) {
            showNotification('Please enter valid values');
            return false;
        }

        if (goalLevel <= currentLevel) {
            showNotification('Goal level must be higher than current level');
            return false;
        }

        const goalXP = levelXP[goalLevel];
        const remainingXP = goalXP - currentXP;
        
        if (remainingXP <= 0) {
            showNotification('You already have enough XP for this level');
            return false;
        }

        const actionsNeeded = Math.ceil(remainingXP / xpPerAction);
        
        const formattedRemainingXP = remainingXP.toLocaleString();
        const formattedActionsNeeded = actionsNeeded.toLocaleString();
        
        const result = `${formattedActionsNeeded} actions needed (${formattedRemainingXP} XP remaining)`;
        document.getElementById('levelResult').value = result;

        const calculation = {
            currentLevel,
            currentXP,
            goalLevel,
            xpPerAction,
            result,
            timestamp: new Date().toISOString()
        };
        levelCalculationHistory.unshift(calculation);
        if (levelCalculationHistory.length > 10) {
            levelCalculationHistory = levelCalculationHistory.slice(0, 10);
        }
        updateLevelHistoryList();
        saveLevelHistory();
        showNotification('Calculation completed!');
    } catch (error) {
        console.error('Calculation error:', error);
        showNotification('Error during calculation');
    }
    return false;
}

function updateLevelHistoryList() {
    const historyList = document.getElementById('level-history-list');
    historyList.innerHTML = '';
    levelCalculationHistory.forEach((calc) => {
        const li = document.createElement('li');
        const formattedXPPerAction = typeof calc.xpPerAction === 'number' ? 
            calc.xpPerAction.toString().replace('.', ',') : calc.xpPerAction;
        li.innerHTML = `Level ${calc.currentLevel} (${calc.currentXP.toLocaleString()} XP) → Level ${calc.goalLevel} with ${formattedXPPerAction} XP/action = ${calc.result}`;
        li.onclick = () => {
            navigator.clipboard.writeText(calc.result)
                .then(() => showNotification('Result copied!'));
        };
        historyList.appendChild(li);
    });
}

function resetLevelForm() {
    document.getElementById('level-calculator-form').reset();
    document.getElementById('levelResult').value = '';
    showNotification('Form reset');
}

function clearLevelHistory() {
    levelCalculationHistory = [];
    updateLevelHistoryList();
    saveLevelHistory();
    showNotification('History cleared');
}

function saveLevelHistory() {
    safelySetToStorage('levelCalculationHistory', levelCalculationHistory);
}

function loadLevelHistory() {
    const saved = safelyGetFromStorage('levelCalculationHistory');
    if (saved) {
        levelCalculationHistory = saved;
        updateLevelHistoryList();
    }
}

function toggleHelp() {
    const modal = document.getElementById('help-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (safelyGetFromStorage('theme')) {
        document.body.classList.add('light-mode');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    }

    loadHistory();
    loadLevelHistory();
    populateLevelSelects();

    const activeTab = safelyGetFromStorage('activeCalculatorTab') || 0;
    switchTab(activeTab);

    const sidebarOpen = safelyGetFromStorage('sidebarOpen');
    if (sidebarOpen) {
        document.querySelector('.sidebar').classList.add('active');
    }

    // Add input validation for seconds field
    const secondsInput = document.getElementById('aeg');
    secondsInput.addEventListener('input', function(e) {
        const value = e.target.value;
        if (value && !validateSecondsInput(value)) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
    // Add input validation for XP per Action field
    const xpPerActionInput = document.getElementById('xpPerAction');
    xpPerActionInput.addEventListener('input', function(e) {
        const value = e.target.value;
        if (value && !validateNumberInput(value)) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });

    // Add input validation for Current XP field
    const currentXPInput = document.getElementById('currentXP');
    currentXPInput.addEventListener('input', function(e) {
        const value = e.target.value;
        if (value && !validateNumberInput(value)) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });

    // Keep basic goal level validation
    document.getElementById('goalLevel').addEventListener('change', function() {
        const currentLevel = parseInt(document.getElementById('currentLevel').value);
        const goalLevel = parseInt(this.value);
        
        if (currentLevel && goalLevel <= currentLevel) {
            showNotification('Goal level must be higher than current level');
            this.value = '';
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetForm();
            resetLevelForm(); 
            document.getElementById('help-modal').style.display = 'none';
        } else if (e.key === 'Enter' && !e.target.matches('input, select')) {
            // Only trigger calculate if not in an input field
            calculate(e);
        }
    });

    // Add modal click handler
    document.addEventListener('click', (event) => {
        const modal = document.getElementById('help-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});