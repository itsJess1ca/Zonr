import type { TestScenario } from '../../src/layout/types.js';

export const testScenarios: TestScenario[] = [
  {
    name: "Current Layout (2x1 + 1x1)",
    zones: [
      { name: "Logs", width: "50", height: "auto", showHeader: true },
      { name: "Metadata", width: "50", height: "auto", showHeader: true },
      { name: "Progress", width: "100%", height: "auto", showHeader: false }
    ],
    terminalSize: { width: 80, height: 24 },
    expectedBehavior: {
      rowCount: 2,
      maxMessagesPerZone: { 
        "Logs": 8,      // (12 - 6 overhead) = 6, but we expect more optimized
        "Metadata": 8,  // Same as logs
        "Progress": 8   // (12 - 4 overhead) = 8
      },
      maxTotalHeight: 23 // 24 - 1 for terminal cursor line
    }
  },
  {
    name: "Vertical Layout (3x1 rows)",
    zones: [
      { name: "Logs", width: "100%", height: "auto", showHeader: true },
      { name: "Metadata", width: "100%", height: "auto", showHeader: true },
      { name: "Progress", width: "100%", height: "auto", showHeader: false }
    ],
    terminalSize: { width: 80, height: 24 },
    expectedBehavior: {
      rowCount: 3,
      maxMessagesPerZone: { 
        "Logs": 2,      // (8 - 6 overhead) = 2
        "Metadata": 2,  // (8 - 6 overhead) = 2  
        "Progress": 4   // (8 - 4 overhead) = 4
      },
      maxTotalHeight: 23 // 24 - 1 for terminal cursor line
    }
  },
  {
    name: "Mixed Auto/Fixed Heights",
    zones: [
      { name: "Logs", width: "50", height: "auto", showHeader: true },
      { name: "Status", width: "50", height: 5, showHeader: true },
      { name: "Progress", width: "100%", height: "auto", showHeader: false }
    ],
    terminalSize: { width: 80, height: 24 },
    expectedBehavior: {
      rowCount: 2,
      maxMessagesPerZone: { 
        "Logs": 1,      // Limited by Status fixed height (5) - 4 overhead = 1
        "Status": 1,    // Fixed height (5) - 4 overhead = 1  
        "Progress": 15  // (23-5=18 remaining - 4 overhead) = 15, reduced by 1 line for terminal
      },
      maxTotalHeight: 23 // 24 - 1 for terminal cursor line
    }
  },
  {
    name: "Three Column Layout",
    zones: [
      { name: "Logs", width: "33", height: "auto", showHeader: true },
      { name: "Metadata", width: "33", height: "auto", showHeader: true },
      { name: "Stats", width: "34", height: "auto", showHeader: true },
      { name: "Progress", width: "100%", height: "auto", showHeader: false }
    ],
    terminalSize: { width: 120, height: 30 },
    expectedBehavior: {
      rowCount: 2,
      maxMessagesPerZone: { 
        "Logs": 9,      // (15 - 6 overhead) = 9
        "Metadata": 9,  // Same
        "Stats": 9,     // Same
        "Progress": 11  // (15 - 4 overhead) = 11
      },
      maxTotalHeight: 30
    }
  },
  {
    name: "Single Zone Full Terminal",
    zones: [
      { name: "Logs", width: "100%", height: "auto", showHeader: true }
    ],
    terminalSize: { width: 80, height: 50 },
    expectedBehavior: {
      rowCount: 1,
      maxMessagesPerZone: { 
        "Logs": 44      // (50 - 6 overhead) = 44
      },
      maxTotalHeight: 50
    }
  },
  {
    name: "Small Terminal Stress Test",
    zones: [
      { name: "Logs", width: "50", height: "auto", showHeader: true },
      { name: "Status", width: "50", height: "auto", showHeader: false }
    ],
    terminalSize: { width: 40, height: 12 },
    expectedBehavior: {
      rowCount: 1,
      maxMessagesPerZone: { 
        "Logs": 6,      // (12 - 6 overhead) = 6
        "Status": 8     // (12 - 4 overhead) = 8
      },
      maxTotalHeight: 12
    }
  },
  {
    name: "Large Terminal Max Utilization",
    zones: [
      { name: "Logs", width: "60", height: "auto", showHeader: true },
      { name: "Sidebar", width: "40", height: "auto", showHeader: true }
    ],
    terminalSize: { width: 200, height: 80 },
    expectedBehavior: {
      rowCount: 1,
      maxMessagesPerZone: { 
        "Logs": 74,     // (80 - 6 overhead) = 74
        "Sidebar": 74   // Same available height
      },
      maxTotalHeight: 80
    }
  }
];

// Edge case scenarios for stress testing
export const edgeCaseScenarios: TestScenario[] = [
  {
    name: "Many Small Zones",
    zones: Array.from({ length: 8 }, (_, i) => ({
      name: `Zone${i + 1}`,
      width: "12.5", // 8 zones * 12.5% = 100%
      height: "auto" as const,
      showHeader: true
    })),
    terminalSize: { width: 160, height: 40 },
    expectedBehavior: {
      rowCount: 1,
      maxMessagesPerZone: Object.fromEntries(
        Array.from({ length: 8 }, (_, i) => [`Zone${i + 1}`, 33]) // (39 - 6) = 33, reduced by 1 for terminal
      ),
      maxTotalHeight: 39 // 40 - 1 for terminal cursor line
    }
  },
  {
    name: "Extremely Tall Terminal",
    zones: [
      { name: "Logs", width: "100%", height: "auto", showHeader: true }
    ],
    terminalSize: { width: 80, height: 200 },
    expectedBehavior: {
      rowCount: 1,
      maxMessagesPerZone: { 
        "Logs": 193     // (199 - 6) = 193, reduced by 1 for terminal
      },
      maxTotalHeight: 199 // 200 - 1 for terminal cursor line
    }
  }
];