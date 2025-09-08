import Zonr from "../src";

// Data processing pipeline demo - showcases auto-height zones
const zonr = new Zonr();

// Input queue - shows incoming data
const inputQueue = zonr.zones.add({
  name: "Input Queue",
  width: "25%",
  height: "auto",
  borderColor: "yellow"
});

// Processing pipeline - shows current operations  
const processingPipeline = zonr.zones.add({
  name: "Processing Pipeline",
  width: "50%",
  height: "auto",
  borderColor: "blue" 
});

// Output results - shows processed data
const outputResults = zonr.zones.add({
  name: "Output Results", 
  width: "25%",
  height: "auto",
  borderColor: "green"
});

// Statistics and metrics at bottom
const statistics = zonr.zones.add({
  name: "Statistics",
  width: "50%",
  height: 8,
  borderColor: "cyan"
});

const errors = zonr.zones.add({
  name: "Errors & Warnings",
  width: "50%", 
  height: 8,
  borderColor: "red"
});

// Data simulation
const dataTypes = ['user-events', 'sensor-data', 'transaction-logs', 'system-metrics', 'audit-logs'];
const processingSteps = ['validation', 'transformation', 'enrichment', 'aggregation', 'storage'];
let totalProcessed = 0;
let totalErrors = 0;
let processingRates = new Map();
let startTime = Date.now();

// Generate realistic data records
const generateDataRecord = () => {
  const type = dataTypes[Math.floor(Math.random() * dataTypes.length)];
  const id = Math.random().toString(36).substr(2, 9);
  const size = Math.floor(Math.random() * 1000) + 100;
  const timestamp = new Date().toISOString();
  
  return { id, type, size, timestamp, status: 'pending' };
};

// Processing queue
const processingQueue = [];
const completedQueue = [];

const addToInputQueue = () => {
  const record = generateDataRecord();
  processingQueue.push(record);
  
  inputQueue.info(`📥 ${record.type} (${record.id})`);
  inputQueue.info(`   Size: ${record.size} bytes`);
  
  // Keep input queue manageable
  if (processingQueue.length > 20) {
    processingQueue.shift();
  }
};

const processData = () => {
  if (processingQueue.length === 0) return;
  
  const record = processingQueue.shift();
  const processingTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds
  
  // Show processing steps
  processingPipeline.info(`🔄 Processing ${record.type} (${record.id})`);
  
  // Simulate processing steps
  let stepIndex = 0;
  const processSteps = setInterval(() => {
    if (stepIndex < processingSteps.length) {
      const step = processingSteps[stepIndex];
      processingPipeline.info(`   ├─ ${step}...`);
      stepIndex++;
    } else {
      clearInterval(processSteps);
      
      // Determine if processing succeeds or fails
      const success = Math.random() > 0.15; // 85% success rate
      
      if (success) {
        record.status = 'completed';
        record.processedAt = new Date().toISOString();
        record.processedSize = Math.floor(record.size * (0.7 + Math.random() * 0.6)); // Compression
        
        completedQueue.push(record);
        processingPipeline.info(`   └─ ✅ Completed in ${(processingTime/1000).toFixed(1)}s`);
        
        outputResults.info(`📤 ${record.type} (${record.id})`);
        outputResults.info(`   Compressed: ${record.size}B → ${record.processedSize}B`);
        
        totalProcessed++;
        
        // Update processing rates
        if (!processingRates.has(record.type)) {
          processingRates.set(record.type, 0);
        }
        processingRates.set(record.type, processingRates.get(record.type) + 1);
        
        // Keep output queue manageable  
        if (completedQueue.length > 15) {
          completedQueue.shift();
        }
      } else {
        record.status = 'failed';
        record.error = 'Validation failed: corrupt data detected';
        
        processingPipeline.error(`   └─ ❌ Failed: ${record.error}`);
        errors.error(`❌ ${record.type} (${record.id}): ${record.error}`);
        
        totalErrors++;
      }
    }
  }, processingTime / processingSteps.length);
};

const updateStatistics = () => {
  const runtime = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(runtime / 3600);
  const minutes = Math.floor((runtime % 3600) / 60);
  const seconds = runtime % 60;
  
  const throughput = runtime > 0 ? (totalProcessed / runtime * 60).toFixed(1) : '0.0';
  const errorRate = totalProcessed + totalErrors > 0 ? ((totalErrors / (totalProcessed + totalErrors)) * 100).toFixed(1) : '0.0';
  
  statistics.clear();
  statistics.info(`📊 Processing Statistics`);
  statistics.info('');
  statistics.info(`Runtime: ${hours}h ${minutes}m ${seconds}s`);
  statistics.info(`Total Processed: ${totalProcessed}`);
  statistics.info(`Total Errors: ${totalErrors}`);
  statistics.info(`Throughput: ${throughput} records/min`);
  statistics.info(`Error Rate: ${errorRate}%`);
  statistics.info(`Queue Size: ${processingQueue.length}`);
};

// Add some initial data
inputQueue.info('🚀 Data processing pipeline started');
processingPipeline.info('⚡ Processing engine ready');
outputResults.info('📋 Output queue initialized');
errors.info('🔍 Error monitoring active');

// Set up intervals
const inputInterval = setInterval(addToInputQueue, 1200); // New data every 1.2 seconds
const processInterval = setInterval(processData, 800); // Process every 0.8 seconds  
const statsInterval = setInterval(updateStatistics, 2000); // Update stats every 2 seconds

// Generate some warnings periodically
const warningInterval = setInterval(() => {
  if (Math.random() < 0.3) {
    const warnings = [
      'High memory usage detected in transformation step',
      'Processing queue growing - consider scaling up',
      'Network latency increased for external API calls',
      'Disk space running low on processing node',
      'Rate limit warning from downstream service'
    ];
    
    const warning = warnings[Math.floor(Math.random() * warnings.length)];
    errors.warn(`⚠️ ${warning}`);
  }
}, 5000);

// Initial statistics  
updateStatistics();

process.on('SIGINT', () => {
  clearInterval(inputInterval);
  clearInterval(processInterval);
  clearInterval(statsInterval);
  clearInterval(warningInterval);
  
  processingPipeline.info('');
  processingPipeline.info('🛑 Processing pipeline shutting down...');
  processingPipeline.info(`Final stats: ${totalProcessed} processed, ${totalErrors} errors`);
  
  setTimeout(() => process.exit(0), 1500);
});

console.log('Data Processing Pipeline Demo - Press Ctrl+C to stop');