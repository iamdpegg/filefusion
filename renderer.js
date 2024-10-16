// renderer.js

const selectDirectoryBtn = document.getElementById('select-directory');
const selectedDirectoryDiv = document.getElementById('selected-directory');
const selectOutputBtn = document.getElementById('select-output');
const selectedOutputDiv = document.getElementById('selected-output');
const startBtn = document.getElementById('start-concatenation');
const statusDiv = document.getElementById('status');
const excludeRegexInput = document.getElementById('exclude-regex');

let inputDirectory = null;
let outputFilePath = null;

// Dark mode toggle functionality
const body = document.body;

function setDarkMode(isDark) {
  if (isDark) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', isDark);
}

function toggleDarkMode() {
  const isDark = !body.classList.contains('dark-mode');
  setDarkMode(isDark);
}

// Set dark mode by default
setDarkMode(true);

// Handle selecting input directory
selectDirectoryBtn.addEventListener('click', async () => {
  const directory = await window.api.selectDirectory();
  if (directory) {
    inputDirectory = directory;
    selectedDirectoryDiv.textContent = inputDirectory;
    logStatus(`Selected input directory: ${inputDirectory}`);
  }
});

// Handle selecting output file location
selectOutputBtn.addEventListener('click', async () => {
  const filePath = await window.api.selectOutputFile();
  if (filePath) {
    outputFilePath = filePath;
    selectedOutputDiv.textContent = outputFilePath;
    logStatus(`Selected output file: ${outputFilePath}`);
  }
});

// Add a clear log function
function clearLog() {
  statusDiv.textContent = '';
}

// Handle start concatenation
startBtn.addEventListener('click', async () => {
  if (!inputDirectory) {
    alert('Please select an input directory.');
    return;
  }
  if (!outputFilePath) {
    alert('Please select an output file location.');
    return;
  }
  
  clearLog();
  logStatus('Starting concatenation...');
  
  const excludePatterns = excludeRegexInput.value
    .split('\n')
    .map(pattern => pattern.trim())
    .filter(pattern => pattern.length > 0);
  
  try {
    await window.api.concatenateFiles({
      inputDir: inputDirectory,
      outputFile: outputFilePath,
      exclude: excludePatterns
    });
    logStatus('Concatenation completed successfully.');
  } catch (error) {
    logStatus(`Error: ${error.message}`);
  }
});

// Function to log status messages
function logStatus(message) {
  const timestamp = new Date().toLocaleTimeString();
  statusDiv.textContent += `[${timestamp}] ${message}\n`;
  statusDiv.scrollTop = statusDiv.scrollHeight;
}

// Listen for progress updates from main process
window.api.onStatusUpdate((event, message) => {
  logStatus(message);
});

// Listen for toggle-dark-mode message from main process
window.api.onToggleDarkMode(() => {
  toggleDarkMode();
});
