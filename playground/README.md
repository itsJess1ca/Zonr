# Zonr Demo Playground

This directory contains various demonstration scripts showcasing different aspects of the Zonr terminal UI library.

## Available Demos

### 🚀 Quick Start - Minimal Demo
```bash
pnpm run demo:minimal
```
**Best for**: First-time users, basic functionality overview
- Simple two-zone layout (logs + status)
- Demonstrates different log levels (info, warn, error, debug)
- Shows real-time updates and zone clearing
- Clean, easy-to-understand example

### 📊 System Dashboard Demo  
```bash
pnpm run demo:dashboard
```
**Best for**: Monitoring applications, system admin tools
- **4-zone layout**: System metrics, application logs, alerts, status bar
- Real-time system metrics simulation (CPU, memory, disk, network)
- Service health monitoring with UP/DOWN status changes
- Dynamic alerts and notifications
- Status bar with uptime and summary info
- Demonstrates mixed fixed/auto heights and custom border colors

### 🏗️ Build System Demo
```bash
pnpm run demo:build
```
**Best for**: CI/CD pipelines, build monitoring
- **4-zone layout**: Build progress, build logs, test results, deployment status
- Simulates a complete build pipeline with 10 steps
- Progress bars and step-by-step execution
- Test result reporting with coverage statistics
- Docker build simulation
- Deployment pipeline visualization

### 📈 Data Processing Pipeline
```bash
pnpm run demo:data
```
**Best for**: ETL processes, data analytics, stream processing
- **5-zone layout**: Input queue, processing pipeline, output results, statistics, errors
- Simulates high-throughput data processing
- Shows different data types and processing steps
- Real-time statistics and throughput metrics
- Error handling and warning systems
- Demonstrates auto-height zones adapting to content

### 🎮 Gaming Server Monitor
```bash
pnpm run demo:gaming
```
**Best for**: Game servers, real-time multiplayer monitoring
- **5-zone layout**: Player activity, server stats, game events, match results, alerts
- Player join/leave simulation
- Match results and leaderboards
- Server performance metrics
- Game events and admin announcements
- Tournament and community features

### 📁 Original File Processing (Legacy)
```bash
pnpm run playground
```
The original file processing demo with progress bars and metadata

## Features Demonstrated

| Feature | Minimal | Dashboard | Build | Data | Gaming |
|---------|---------|-----------|-------|------|--------|
| **Auto Height Zones** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Fixed Height Zones** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Custom Border Colors** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multiple Log Levels** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Real-time Updates** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Zone Clearing** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Progress Visualization** | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Complex Layouts** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Statistics/Metrics** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Error Handling** | ✅ | ✅ | ✅ | ✅ | ✅ |

## Running Demos

All demos are designed to run continuously and can be stopped with **Ctrl+C**. They will perform cleanup and show shutdown messages.

### Requirements
- Node.js 16+
- Terminal with color support
- Recommended terminal size: 120x30 or larger for best experience

### Tips
- Resize your terminal to see how zones adapt dynamically
- Let demos run for a few minutes to see full behavior patterns
- Each demo shows different update frequencies and data patterns
- Check the console output for additional information

## Demo Characteristics

- **Minimal**: Updates every 1.5s, simple patterns
- **Dashboard**: Fast updates (1-2s), realistic system metrics
- **Build**: Sequential pipeline execution, step-by-step progress
- **Data**: High-frequency updates (0.8-1.2s), processing simulation
- **Gaming**: Real-time feel (1s updates), player activity simulation

## Customization

Each demo is self-contained and can be easily modified to test:
- Different zone configurations
- Custom border colors
- Various update patterns
- Different terminal layouts
- Specific use case scenarios

Feel free to copy and modify any demo as a starting point for your own Zonr applications!