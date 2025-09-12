import Zonr from "../src";
import { ProgressBar } from "./progressBar";

const zonr = new Zonr();
const logger = zonr.zones.add({
  name: "Logs",
  additionalTransports: [
    "file"
  ],
  width: "60%",
  height: 20
})

const metadata = zonr.zones.add({
  name: "Metadata",
  width: "40%",
  height: 10,
  borderColor: "cyan"
});

const progressBar = zonr.zones.add({
  name: "Progress", 
  width: "100%",
  showHeader: true,
  height: 1
});

const filesToProcess = Array.from({ length: 1000 }, (_, i) => `file_${i + 1}.txt`);
const batchSize = 5;
let i = 0;
let currentBatch = 0;
let startTime = Date.now();
let filesPerSecond = 0;
let lastUpdateTime = startTime;

const updateMetadata = () => {
  const now = Date.now();
  const elapsed = (now - startTime) / 1000;
  const timeSinceLastUpdate = (now - lastUpdateTime) / 1000;
  
  if (timeSinceLastUpdate >= 1) {
    filesPerSecond = i > 0 ? Math.round(i / elapsed * 10) / 10 : 0;
    lastUpdateTime = now;
  }
  
  const remaining = filesToProcess.length - i;
  const eta = filesPerSecond > 0 ? Math.round(remaining / filesPerSecond) : 0;
  const totalBatches = Math.ceil(filesToProcess.length / batchSize);
  
  metadata.clear();
  metadata.info(`Total Files: ${filesToProcess.length}`);
  metadata.info(`Batch Size: ${batchSize}`);
  metadata.info(`Current Batch: ${currentBatch + 1}/${totalBatches}`);
  metadata.info(`Files Processed: ${i}`);
  metadata.info(`Files Remaining: ${remaining}`);
  metadata.info(`Processing Rate: ${filesPerSecond}/sec`);
  metadata.info(`Elapsed Time: ${Math.round(elapsed)}s`);
  metadata.info(`Status: ${remaining === 0 ? "Completed" : "Processing"}`);
  if (eta > 0) {
    metadata.info(`ETA: ${eta}s`);
  }
};

const interval = setInterval(() => {
  const str = ProgressBar(i, filesToProcess.length, progressBar.innerWidth);
  progressBar.clear();
  progressBar.info(str);
  updateMetadata();
}, 100);

const processFile = (file: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      logger.info(`Processed ${file}`);
      i++;
      resolve();
    }, Math.random() * 100);
  });
};

const main = async () => {
  const batches = filesToProcess.reduce((acc: string[][], file, index) => {
    const batchIndex = Math.floor(index / batchSize);
    if (!acc[batchIndex]) {
      acc[batchIndex] = [];
    }
    acc[batchIndex].push(file);
    return acc;
  }, []);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    currentBatch = batchIndex;
    const batch = batches[batchIndex];
    await Promise.all(batch.map(file => processFile(file)));
  }
};

main().then(() => {
  clearInterval(interval);
  progressBar.clear();
  progressBar.info(ProgressBar(i, filesToProcess.length, progressBar.innerWidth));
  logger.info("All files processed.");
  
  // Final metadata update
  updateMetadata();
});