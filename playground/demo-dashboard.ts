import Zonr from "../src";

// System monitoring dashboard demo
const zonr = new Zonr();

// Left sidebar - system metrics  
const systemMetrics = zonr.addZone({
  name: "System Metrics",
  width: "30%", 
  height: "auto",
  borderColor: "blue"
});

// Center - main logs
const mainLogs = zonr.addZone({
  name: "Application Logs",
  width: "50%",
  height: "auto", 
  borderColor: "blue"
});

// Right sidebar - alerts/notifications
const alerts = zonr.addZone({
  name: "Alerts",
  width: "20%",
  height: "auto",
  borderColor: "red"
});

// Bottom status bar - no header for clean look
const statusBar = zonr.addZone({
  name: "Status",
  width: "100%",
  height: 5,
  showHeader: false,
  borderColor: "blue"
});

// Simulate system metrics
let cpuUsage = 15;
let memoryUsage = 45; 
let diskUsage = 78;
let networkIn = 0;
let networkOut = 0;

const services = ['auth-service', 'api-gateway', 'user-service', 'payment-service', 'notification-service'];
const serviceStatus = new Map(services.map(s => [s, Math.random() > 0.8 ? 'DOWN' : 'UP']));

const updateSystemMetrics = () => {
  // Realistic CPU fluctuation
  cpuUsage = Math.max(5, Math.min(95, cpuUsage + (Math.random() - 0.5) * 10));
  memoryUsage = Math.max(30, Math.min(85, memoryUsage + (Math.random() - 0.5) * 3));
  diskUsage = Math.max(60, Math.min(95, diskUsage + (Math.random() - 0.5) * 1));
  
  networkIn = Math.random() * 150;
  networkOut = Math.random() * 80;

  systemMetrics.clear();
  systemMetrics.info(`CPU Usage: ${cpuUsage.toFixed(1)}%`);
  systemMetrics.info(`Memory: ${memoryUsage.toFixed(1)}%`);  
  systemMetrics.info(`Disk: ${diskUsage.toFixed(1)}%`);
  systemMetrics.info(`Net In: ${networkIn.toFixed(1)} MB/s`);
  systemMetrics.info(`Net Out: ${networkOut.toFixed(1)} MB/s`);
  systemMetrics.info('');
  systemMetrics.info('Service Health:');
  
  for (const [service, status] of serviceStatus) {
    if (status === 'UP') {
      systemMetrics.info(`✓ ${service}`);
    } else {
      systemMetrics.error(`✗ ${service}`);
    }
  }
};

const updateStatus = () => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const timestamp = new Date().toLocaleTimeString();
  const downServices = Array.from(serviceStatus.entries()).filter(([_, status]) => status === 'DOWN').length;
  
  statusBar.clear();
  statusBar.info(`[${timestamp}] Uptime: ${hours}h ${minutes}m ${seconds}s | Services: ${services.length - downServices}/${services.length} UP | CPU: ${cpuUsage.toFixed(1)}% | Mem: ${memoryUsage.toFixed(1)}%`);
};

// Simulate application events
const logEvents = [
  'User authentication successful',
  'Payment processed successfully', 
  'API request completed',
  'Database connection established',
  'Cache miss - fetching from DB',
  'Background job queued',
  'WebSocket connection opened',
  'File upload completed',
  'Email notification sent',
  'Session expired - user logged out'
];

const errorEvents = [
  'Failed to connect to payment gateway',
  'Database query timeout',
  'Invalid API key provided',
  'Rate limit exceeded',
  'Internal server error',
  'Failed to send notification'
];

const generateLogEvent = () => {
  if (Math.random() < 0.1) {
    // 10% chance of error
    const event = errorEvents[Math.floor(Math.random() * errorEvents.length)];
    mainLogs.error(`[ERROR] ${event}`);
    
    // Sometimes trigger alerts for errors
    if (Math.random() < 0.7) {
      alerts.error(`🚨 ${event}`);
    }
  } else if (Math.random() < 0.15) {
    // 15% chance of warning
    mainLogs.warn(`[WARN] High response time detected: ${(Math.random() * 2000 + 500).toFixed(0)}ms`);
  } else {
    // Normal info log
    const event = logEvents[Math.floor(Math.random() * logEvents.length)];
    mainLogs.info(`[INFO] ${event}`);
  }
};

// Simulate service health changes
const updateServiceHealth = () => {
  for (const service of services) {
    if (Math.random() < 0.05) { // 5% chance of status change
      const currentStatus = serviceStatus.get(service);
      const newStatus = currentStatus === 'UP' ? 'DOWN' : 'UP';
      serviceStatus.set(service, newStatus);
      
      if (newStatus === 'DOWN') {
        alerts.error(`🚨 Service DOWN: ${service}`);
        mainLogs.error(`[ERROR] Service ${service} is now DOWN`);
      } else {
        alerts.info(`✅ Service UP: ${service}`);
        mainLogs.info(`[INFO] Service ${service} is now UP`);
      }
    }
  }
};

// Generate some initial activity
mainLogs.info('[INFO] System dashboard started');
mainLogs.info('[INFO] All monitoring services initialized');
alerts.info('📊 Dashboard online');
alerts.info('🔍 Monitoring active');

// Set up intervals for realistic data updates
const metricsInterval = setInterval(updateSystemMetrics, 2000);
const statusInterval = setInterval(updateStatus, 1000);
const logInterval = setInterval(generateLogEvent, 800);
const healthInterval = setInterval(updateServiceHealth, 5000);

// Initial updates
updateSystemMetrics();
updateStatus();

// Cleanup on exit
process.on('SIGINT', () => {
  clearInterval(metricsInterval);
  clearInterval(statusInterval);
  clearInterval(logInterval);
  clearInterval(healthInterval);
  
  mainLogs.info('[INFO] Dashboard shutting down...');
  setTimeout(() => process.exit(0), 1000);
});

console.log('System Dashboard Demo - Press Ctrl+C to exit');