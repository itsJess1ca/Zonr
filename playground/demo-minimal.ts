import Zonr from "../src";

// Minimal demo showing basic functionality
const zonr = new Zonr();

// Simple two-zone layout
const logs = zonr.addZone({
  name: "Application Logs",
  width: "70%",
  height: "auto",
  borderColor: "blue"
});

const status = zonr.addZone({
  name: "Status", 
  width: "30%",
  height: "auto",
  borderColor: "green"
});

// Demo different log levels
let counter = 0;

const addLogEntry = () => {
  counter++;
  
  if (counter % 10 === 0) {
    logs.error(`Error #${counter}: Something went wrong!`);
    status.error(`Errors: ${Math.floor(counter/10)}`);
  } else if (counter % 7 === 0) {
    logs.warn(`Warning #${counter}: This might be a problem`);
  } else if (counter % 3 === 0) {
    logs.debug(`Debug #${counter}: Detailed information here`);
  } else {
    logs.info(`Info #${counter}: Normal operation message`);
  }
  
  // Update status
  status.clear();
  status.info(`Total Messages: ${counter}`);
  status.info(`Uptime: ${Math.floor(process.uptime())}s`);
  status.info(`Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  status.info(`Time: ${new Date().toLocaleTimeString()}`);
};

// Add initial message
logs.info('🚀 Application started');
status.info('✅ System ready');

// Add a new log entry every 1.5 seconds
const interval = setInterval(addLogEntry, 1500);

process.on('SIGINT', () => {
  clearInterval(interval);
  logs.info('👋 Application shutting down...');
  setTimeout(() => process.exit(0), 1000);
});

console.log('Minimal Demo - Press Ctrl+C to exit');