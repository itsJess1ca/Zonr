import Zonr from "../src";

// Build system demo - simulates a complex build pipeline
const zonr = new Zonr();

// Build steps progress zone  
const buildProgress = zonr.addZone({
  name: "Build Pipeline",
  width: "60%",
  height: 12,
  borderColor: "blue"
});

// Build logs zone
const buildLogs = zonr.addZone({
  name: "Build Output", 
  width: "40%",
  height: "auto",
  borderColor: "blue"
});

// Test results zone
const testResults = zonr.addZone({
  name: "Test Results",
  width: "50%", 
  height: "auto",
  borderColor: "blue"
});

// Deployment status
const deployment = zonr.addZone({
  name: "Deployment",
  width: "50%",
  height: "auto", 
  borderColor: "magenta"
});

const buildSteps = [
  { name: 'Environment Setup', duration: 400 },
  { name: 'Dependency Installation', duration: 800 },
  { name: 'Code Compilation', duration: 1000 },
  { name: 'Unit Tests', duration: 800 },
  { name: 'Integration Tests', duration: 1200 },
  { name: 'Code Coverage Analysis', duration: 600 },
  { name: 'Security Scan', duration: 800 },
  { name: 'Build Artifacts', duration: 500 },
  { name: 'Docker Image Build', duration: 1500 },
  { name: 'Quality Gate Check', duration: 400 }
];

let currentStep = 0;
let stepStartTime = Date.now();
let buildStartTime = Date.now();

const updateBuildProgress = () => {
  if (currentStep >= buildSteps.length) return;
  
  const step = buildSteps[currentStep];
  const elapsed = Date.now() - stepStartTime;
  const progress = Math.min((elapsed / step.duration) * 100, 100);
  
  buildProgress.clear();
  buildProgress.info(`🏗️  Build Pipeline Progress`);
  buildProgress.info('');
  
  // Show all steps with status
  buildSteps.forEach((s, index) => {
    if (index < currentStep) {
      buildProgress.info(`✅ ${s.name}`);
    } else if (index === currentStep) {
      const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
      buildProgress.info(`🔄 ${s.name}`);
      buildProgress.info(`   [${bar}] ${progress.toFixed(1)}%`);
    } else {
      buildProgress.info(`⏳ ${s.name}`);
    }
  });
  
  const totalElapsed = Math.floor((Date.now() - buildStartTime) / 1000);
  buildProgress.info('');
  buildProgress.info(`Total Elapsed: ${Math.floor(totalElapsed / 60)}m ${totalElapsed % 60}s`);
};

const generateBuildLogs = () => {
  const step = buildSteps[currentStep];
  if (!step) return;
  
  const logs = {
    'Environment Setup': [
      'Setting up Node.js environment...',
      'Node version: v20.11.0',
      'npm version: 10.2.4',
      'Setting environment variables'
    ],
    'Dependency Installation': [
      'Installing production dependencies...',
      'Installing development dependencies...',
      '+ react@18.2.0',
      '+ typescript@5.3.0',
      '+ @types/node@20.10.0',
      'Auditing packages for vulnerabilities...',
      'Found 0 vulnerabilities'
    ],
    'Code Compilation': [
      'Compiling TypeScript...',
      'Checking types in src/components/...',
      'Checking types in src/utils/...',
      'Generating declaration files...',
      'Build successful: 0 errors, 0 warnings'
    ],
    'Unit Tests': [
      'Running unit tests...',
      'PASS src/utils/helpers.test.ts',
      'PASS src/components/Button.test.tsx', 
      'PASS src/hooks/useAuth.test.ts',
      'Test Suites: 12 passed, 12 total',
      'Tests: 84 passed, 84 total'
    ],
    'Integration Tests': [
      'Starting integration test suite...',
      'PASS tests/integration/api.test.ts',
      'PASS tests/integration/database.test.ts',
      'PASS tests/integration/auth-flow.test.ts',
      'Integration Tests: 8 passed, 8 total'
    ],
    'Code Coverage Analysis': [
      'Generating coverage report...',
      'Statements: 89.2% (425/476)',
      'Branches: 85.1% (178/209)', 
      'Functions: 92.3% (96/104)',
      'Lines: 88.8% (410/462)',
      'Coverage threshold met ✓'
    ],
    'Security Scan': [
      'Running security vulnerability scan...',
      'Scanning dependencies for known issues...',
      'Checking for exposed secrets...',
      'Running static security analysis...',
      'Security scan completed: No issues found'
    ],
    'Build Artifacts': [
      'Generating production build...',
      'Optimizing bundle size...',
      'Creating source maps...',
      'Build artifacts created successfully'
    ],
    'Docker Image Build': [
      'Building Docker image...',
      'Step 1/8: FROM node:20-alpine',
      'Step 2/8: WORKDIR /app',
      'Step 3/8: COPY package*.json ./',
      'Step 4/8: RUN npm ci --only=production',
      'Step 5/8: COPY . .',
      'Step 6/8: EXPOSE 3000',
      'Step 7/8: RUN npm run build',
      'Step 8/8: CMD ["npm", "start"]',
      'Image built successfully: app:latest'
    ],
    'Quality Gate Check': [
      'Running final quality checks...',
      'Code coverage: PASSED',
      'Security scan: PASSED', 
      'Performance tests: PASSED',
      'All quality gates passed ✓'
    ]
  };
  
  const stepLogs = logs[step.name as keyof typeof logs] || [];
  if (stepLogs.length > 0) {
    const randomLog = stepLogs[Math.floor(Math.random() * stepLogs.length)];
    buildLogs.info(randomLog);
  }
};

const generateTestResults = () => {
  if (currentStep < 3) return; // Only show after unit tests start
  
  const testSuites = [
    'Authentication', 'UserManagement', 'PaymentProcessing',
    'OrderManagement', 'NotificationService', 'ReportGeneration',
    'DataValidation', 'APIEndpoints', 'DatabaseOperations'
  ];
  
  testResults.clear();
  testSuites.forEach(suite => {
    const passed = Math.floor(Math.random() * 15) + 5;
    const failed = Math.random() < 0.1 ? Math.floor(Math.random() * 2) : 0;
    const status = failed > 0 ? '❌' : '✅';
    testResults.info(`${status} ${suite}: ${passed} passed${failed > 0 ? `, ${failed} failed` : ''}`);
  });
  
  if (currentStep >= 4) {
    testResults.info('');
    testResults.info('Coverage Summary:');
    testResults.info(`Lines: 88.8% (410/462)`);
    testResults.info(`Branches: 85.1% (178/209)`);
    testResults.info(`Functions: 92.3% (96/104)`);
  }
};

const updateDeployment = () => {
  if (currentStep < 8) {
    deployment.clear();
    deployment.info('⏳ Waiting for build completion...');
    return;
  }
  
  deployment.clear();
  
  if (currentStep === buildSteps.length) {
    deployment.info('🚀 Deployment Pipeline');
    deployment.info('');
    deployment.info('✅ Build completed successfully');
    deployment.info('✅ Docker image pushed to registry');
    deployment.info('🔄 Deploying to staging environment...');
    deployment.info('');
    deployment.info('Environment: staging-k8s-cluster');
    deployment.info('Version: v1.2.3-abc123');
    deployment.info('Replicas: 3/3 ready');
    deployment.info('');
    deployment.info('🔍 Running smoke tests...');
  } else {
    deployment.info('📦 Preparing deployment...');
    deployment.info('Build must complete first');
  }
};

// Start the build process
buildLogs.info('🏗️ Starting build pipeline...');
buildLogs.info('Repository: https://github.com/company/awesome-app.git');
buildLogs.info('Branch: main');
buildLogs.info('Commit: abc123def - Add new payment feature');

const buildInterval = setInterval(() => {
  if (currentStep >= buildSteps.length) {
    buildLogs.info('');
    buildLogs.info('🎉 Build pipeline completed successfully!');
    buildLogs.info(`Total build time: ${Math.floor((Date.now() - buildStartTime) / 1000)}s`);
    clearInterval(buildInterval);
    return;
  }
  
  const step = buildSteps[currentStep];
  const elapsed = Date.now() - stepStartTime;
  
  if (elapsed >= step.duration) {
    buildLogs.info(`✅ ${step.name} completed`);
    currentStep++;
    stepStartTime = Date.now();
    
    if (currentStep < buildSteps.length) {
      buildLogs.info(`🔄 Starting ${buildSteps[currentStep].name}...`);
    }
  }
  
  updateBuildProgress();
  
  // Generate logs periodically during step
  if (Math.random() < 0.3) {
    generateBuildLogs();
  }
  
  generateTestResults();
  updateDeployment();
  
}, 200);

// Initial display
updateBuildProgress();
buildLogs.info(`🔄 Starting ${buildSteps[0].name}...`);

process.on('SIGINT', () => {
  clearInterval(buildInterval);
  buildLogs.info('');
  buildLogs.info('❌ Build cancelled by user');
  setTimeout(() => process.exit(0), 1000);
});

console.log('Build System Demo - Press Ctrl+C to cancel build');