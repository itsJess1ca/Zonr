<div align="center">

![Zonr Logo](public/full.svg)

</div>

> A modern TypeScript library for building organized, dynamic terminal interfaces with zone-based layouts

[![npm version](https://badge.fury.io/js/zonr.svg)](https://badge.fury.io/js/zonr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/zonr.svg)](https://nodejs.org/)

---

## 🚀 Hero Demo

<!-- Add hero GIF/image showcasing the main functionality -->
*[Hero image/GIF placeholder - showcasing multiple zones with real-time updates]*

Zonr transforms terminal output from chaotic text streams into organized, responsive interfaces. Create dashboards, build tools, monitoring systems, and interactive applications with intuitive zone-based layouts that adapt to your terminal size.

---

## ✨ Key Features

- **🎯 Zone-Based Architecture**: Organize output into distinct, configurable areas
- **📐 Dynamic Layout System**: Automatic row grouping with intelligent space distribution  
- **📱 Responsive Design**: Zones adapt automatically to terminal size changes
- **⚡ Real-Time Updates**: Event-driven messaging for instant UI updates
- **🎨 Customizable Styling**: Configurable borders, colors, headers, and dimensions
- **🔧 Perfect Alignment**: Custom ANSI renderer ensures pixel-perfect borders
- **🌍 Wide Character Support**: Proper handling of emoji and Unicode characters
- **🚀 High Performance**: Differential rendering updates only changed content
- **🪟 Cross-Platform**: Full Windows support with resize detection workarounds

---

## 📦 Installation

```bash
npm install zonr
# or
pnpm add zonr  
# or
yarn add zonr
```

**Requirements:** Node.js ≥16

---

## 🎮 Quick Start

```typescript
import Zonr from 'zonr';

// Create a new terminal UI
const zonr = new Zonr();

// Add zones with different layouts
const logs = zonr.addZone({
  name: "Application Logs",
  width: "70%",
  height: "auto", 
  borderColor: "blue"
});

const status = zonr.addZone({
  name: "System Status",
  width: "30%", 
  height: "auto",
  borderColor: "green"
});

// Start logging
logs.info('🚀 Application started');
logs.warn('⚠️  High memory usage detected');
logs.error('❌ Database connection failed');

status.info('✅ Server: Online');
status.info('📊 CPU: 45%'); 
status.info('💾 Memory: 2.1GB');
```

---

## 🎬 Demo Gallery

### Minimal Dashboard
<!-- Add GIF showing basic two-zone layout -->
*[GIF placeholder: Basic logs + status layout]*

```bash
pnpm run demo:minimal
```

### Gaming Interface  
<!-- Add GIF showing gaming demo with emojis and complex layout -->
*[GIF placeholder: Gaming zones with emojis, stats, leaderboard]*

```bash
pnpm run demo:gaming
```

### Build System Monitor
<!-- Add GIF showing build pipeline visualization -->
*[GIF placeholder: Build stages, progress bars, test results]*

```bash
pnpm run demo:build
```

### Data Processing Dashboard
<!-- Add GIF showing data processing with metrics -->
*[GIF placeholder: Data streams, processing metrics, charts]*

```bash
pnpm run demo:data
```

### Full Development Dashboard
<!-- Add GIF showing comprehensive development environment -->
*[GIF placeholder: Comprehensive multi-zone developer interface]*

```bash
pnpm run demo:dashboard
```

---

## 📚 API Reference

### Creating a Zonr Instance

```typescript
import Zonr from 'zonr';

const zonr = new Zonr();
```

### Adding Zones

```typescript
const zone = zonr.addZone({
  name: string,           // Zone header text
  width: string | number, // "50%", "auto", or pixel value
  height: string | number,// "auto", "50%", or pixel value  
  borderColor?: string,   // "red", "blue", "green", etc.
  showHeader?: boolean,   // Show/hide zone header
  showBorder?: boolean    // Show/hide zone borders
});
```

### Zone Methods

```typescript
// Logging methods
zone.info(message: string)    // Blue info message
zone.warn(message: string)    // Yellow warning message  
zone.error(message: string)   // Red error message
zone.debug(message: string)   // Gray debug message
zone.log(message: string)     // Default log message

// Zone management
zone.clear()                  // Clear all messages
zone.getName()               // Get zone name
zone.getConfig()             // Get zone configuration
```

### Zone Management

```typescript
// Zone management methods
zonr.addZone(config)         // Add a new zone
zonr.getZone(name)           // Find zone by name
zonr.hasZone(name)           // Check if zone exists
zonr.getAllZones()           // Get all zones array
zonr.removeZone(nameOrZone)  // Remove specific zone by name or reference
zonr.clearZones()            // Remove all zones

// Legacy API still available
zonr.zones.add(config)       // Same as zonr.addZone()
zonr.zones.get(name)         // Same as zonr.getZone()
zonr.zones.list()            // Same as zonr.getAllZones()
```

### Layout Configuration

```typescript
// Width options
width: "50%"        // Percentage of terminal width
width: "auto"       // Automatic width distribution
width: 80           // Fixed pixel width

// Height options  
height: "auto"      // Adapts to terminal size and content
height: "30%"       // Percentage of terminal height
height: 20          // Fixed row height

// Color options
borderColor: "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray"
```

---

## 🎯 Use Cases

### Development Tools
- **Build Monitors**: Track compilation, testing, and deployment stages
- **Log Aggregation**: Organize application logs by service or severity
- **Development Servers**: Show multiple service statuses simultaneously

### System Monitoring  
- **Server Dashboards**: Display metrics, alerts, and system health
- **Process Monitoring**: Track multiple running processes and their output
- **Network Tools**: Monitor connections, throughput, and diagnostics

### Interactive Applications
- **Gaming Interfaces**: Leaderboards, chat, game state visualization  
- **CLI Tools**: Multi-step workflows with progress tracking
- **Data Processing**: Real-time pipeline monitoring and statistics

---

## 🔧 Advanced Usage

### Custom Transports

```typescript
import { FileTransport } from 'zonr';

// Log to file in addition to terminal
const fileTransport = new FileTransport('./app.log');

const zone = zonr.zones.add({
  name: "Persistent Logs",
  width: "100%",
  height: "auto",
  transports: [fileTransport]
});
```

### Event-Driven Updates

```typescript
// Zones automatically emit events for real-time updates
zone.info('Processing started...');

// Updates are immediately reflected in the terminal
setTimeout(() => {
  zone.info('Processing completed ✅');
}, 2000);
```

### Dynamic Layout Changes

```typescript
// Zones automatically reflow when terminal is resized
// No additional code needed - Zonr handles it automatically!

// Works perfectly on Windows with built-in resize detection
```

---

## 🏗️ Architecture

Zonr uses a custom ANSI-based rendering system that provides:

- **Direct Terminal Control**: Precise cursor positioning and screen management
- **Differential Updates**: Only redraws changed content to eliminate flicker
- **Layout Engine**: Sophisticated algorithm for space distribution and row grouping
- **Event System**: Real-time communication between zones and renderer
- **Windows Compatibility**: Specialized handling for Windows terminal limitations

### Key Components

- **Zonr Class**: Main facade providing the public API
- **Zone Manager**: Handles zone lifecycle and organization  
- **Layout Calculator**: Dynamic space allocation and row grouping
- **Custom Renderer**: ANSI-based rendering with perfect border alignment
- **Transport System**: Pluggable output destinations (terminal, file, etc.)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd zonr

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Try the demos
pnpm run demo:minimal
pnpm run demo:gaming
```

### Running Tests

```bash
pnpm test           # Run tests in watch mode
pnpm test:run       # Run tests once
pnpm test:ui        # Run tests with UI
```

---

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Built with TypeScript for excellent developer experience
- Inspired by modern terminal UI libraries but designed for simplicity
- Special thanks to the Node.js community for terminal handling insights

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/zonr/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/zonr/discussions)
- 📧 **Email**: your.email@example.com

---

<div align="center">

**[⭐ Give us a star on GitHub!](https://github.com/yourusername/zonr)**

Made with ❤️ for the terminal-loving community

</div>