# Contributing to Zonr

Thank you for your interest in contributing to Zonr! We welcome contributions from the community and are excited to see what you'll build with our zone-based terminal UI library.

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥16.0.0
- **pnpm** (preferred) or npm
- **Git**
- A terminal that supports ANSI escape sequences

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/zonr.git
   cd zonr
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Verify Setup**
   ```bash
   # Build the project
   pnpm build
   
   # Run tests
   pnpm test
   
   # Try a demo
   pnpm run demo:minimal
   ```

## 🛠️ Development Workflow

### Project Structure

```
src/
├── renderer/             # Custom ANSI rendering system
│   ├── ansi-renderer.ts  # Core ANSI escape sequences
│   ├── zone-renderer.ts  # Zone-specific rendering
│   └── layout-renderer.ts# Layout orchestration
├── layout/              # Dynamic layout system
│   ├── calculator.ts    # Layout algorithms
│   └── types.ts         # Layout type definitions
├── transports/          # Output destinations
├── events.ts            # Global event system
├── types.ts             # Core type definitions
├── zone.ts              # Zone implementation
├── zone-manager.ts      # Zone lifecycle management
└── zonr.ts              # Main facade class

playground/              # Demo applications
tests/                   # Test suites
```

### Available Scripts

```bash
# Development
pnpm build              # Compile TypeScript
pnpm dev                # Watch mode compilation
pnpm playground         # Run main playground demo

# Testing
pnpm test               # Run tests in watch mode
pnpm test:run           # Run tests once
pnpm test:ui            # Run tests with UI

# Quality
pnpm lint               # ESLint checking
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Format with Prettier
pnpm format:check       # Check formatting
pnpm typecheck          # TypeScript validation

# Demos
pnpm run demo:minimal   # Simple two-zone demo
pnpm run demo:gaming    # Gaming server monitor
pnpm run demo:build     # Build pipeline demo
pnpm run demo:data      # Data processing demo
pnpm run demo:dashboard # Full development dashboard
```

## 📝 Contributing Guidelines

### Before You Start

1. **Check existing issues** - Look for related issues or discussions
2. **Create an issue** - For new features or significant changes, create an issue first
3. **Fork the repository** - Work on your own fork
4. **Create a feature branch** - Use descriptive branch names

### Types of Contributions

#### 🐛 Bug Fixes
- Fix rendering issues, layout bugs, or performance problems
- Improve Windows Terminal compatibility
- Fix emoji or Unicode rendering issues

#### ✨ New Features  
- New zone configuration options
- Additional layout algorithms
- New transport implementations
- Enhanced event system features

#### 📚 Documentation
- Improve README, API docs, or code comments
- Add new demo applications
- Create tutorials or guides

#### 🧪 Tests
- Add unit tests for layout calculations
- Create integration tests for rendering
- Add edge case coverage

### Code Style Guidelines

#### TypeScript Standards
- Use **strict TypeScript** - all code must type-check
- Prefer **interfaces over types** for public APIs
- Use **explicit return types** for public methods
- Include **JSDoc comments** for public APIs

#### Code Organization
- **Single responsibility** - each class/function has one clear purpose
- **Immutable patterns** - avoid mutating configuration objects
- **Error handling** - graceful degradation with sensible defaults
- **Platform compatibility** - consider Windows Terminal limitations

#### Naming Conventions
- **PascalCase** for classes and interfaces (`ZoneConfig`)
- **camelCase** for methods and variables (`addZone`)
- **UPPER_CASE** for constants (`DEFAULT_BORDER_COLOR`)
- **kebab-case** for file names (`zone-renderer.ts`)

#### Example Code Style
```typescript
/**
 * Represents a terminal UI zone with customizable layout and styling
 */
export interface ZoneConfig {
  /** Display name for the zone header */
  name: string;
  /** Zone width as percentage, pixels, or 'auto' */
  width?: string | number;
  /** Zone height as percentage, pixels, or 'auto' */  
  height?: string | number | 'auto';
  /** ANSI color for zone borders */
  borderColor?: ANSIColor;
}

/**
 * Creates a new zone with the specified configuration
 */
public addZone(config: ZoneConfig): Zone {
  // Implementation with proper error handling
  if (!config.name) {
    throw new Error('Zone name is required');
  }
  
  return this.zoneManager.createZone(config);
}
```

### Testing Requirements

#### Unit Tests
- **Layout calculations** - Test width/height distribution algorithms
- **Zone management** - Test zone creation, updates, removal
- **Type validation** - Test TypeScript type constraints

#### Integration Tests  
- **Rendering pipeline** - Test complete zone rendering
- **Event system** - Test zone-to-renderer communication
- **Layout scenarios** - Test complex multi-zone layouts

#### Test Structure
```typescript
describe('LayoutCalculator', () => {
  describe('distributeWidths', () => {
    it('should distribute available width among zones', () => {
      // Arrange
      const zones = [
        createZone({ name: 'A', width: '50%' }),
        createZone({ name: 'B', width: '50%' })
      ];
      
      // Act  
      const result = LayoutCalculator.distributeWidths(zones, 100);
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].calculatedWidth).toBe(46); // 50% minus borders
      expect(result[1].calculatedWidth).toBe(46);
    });
  });
});
```

### Pull Request Process

#### 1. Preparation
- [ ] Create issue for discussion (for significant changes)
- [ ] Fork repository and create feature branch
- [ ] Write code following style guidelines
- [ ] Add/update tests as needed
- [ ] Update documentation if required

#### 2. Quality Checks
```bash
# Before submitting PR, ensure all checks pass:
pnpm build          # ✅ TypeScript compilation
pnpm test:run       # ✅ All tests passing  
pnpm lint           # ✅ No linting errors
pnpm format:check   # ✅ Code properly formatted
```

#### 3. Pull Request
- **Descriptive title** - Summarize the change clearly
- **Detailed description** - Explain what and why
- **Link related issues** - Reference issue numbers
- **Add screenshots/GIFs** - For UI changes, show before/after

#### PR Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)  
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All existing tests pass

## Screenshots/GIFs
For UI changes, include visual evidence.

Closes #issue_number
```

#### 4. Review Process
- **Automated checks** - CI must pass
- **Code review** - Maintainer review required
- **Testing** - Verify functionality works
- **Documentation** - Ensure docs are updated

## 🎯 Areas for Contribution

### High Priority
- **Windows Terminal improvements** - Better resize detection, color support
- **Performance optimizations** - Faster rendering, memory efficiency  
- **Layout enhancements** - New layout algorithms, responsive design
- **Documentation** - API docs, tutorials, examples

### Medium Priority
- **New transport types** - Database logging, webhook notifications
- **Theme system** - Predefined color schemes and styling
- **Configuration validation** - Better error messages and type checking
- **Testing coverage** - Edge cases and integration scenarios

### Good First Issues
- **Demo applications** - New playground examples
- **Bug fixes** - Small rendering or layout issues
- **Documentation** - README improvements, code comments
- **Test additions** - Unit tests for existing functionality

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:

- **Zonr version** - `pnpm list zonr`
- **Node.js version** - `node --version`
- **Operating system** - OS and version
- **Terminal application** - Which terminal you're using
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Reproduction steps** - Minimal code to reproduce
- **Screenshots/GIFs** - Visual evidence if applicable

### Feature Requests
For new features, please provide:

- **Use case** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches you've thought of
- **Breaking changes** - Would this affect existing code?

## 🤝 Code of Conduct

### Our Standards
- **Be respectful** - Treat all contributors with respect
- **Be inclusive** - Welcome newcomers and diverse perspectives  
- **Be collaborative** - Work together constructively
- **Be professional** - Keep discussions focused and productive

### Enforcement
Project maintainers have the right to remove, edit, or reject comments, commits, code, issues, and other contributions that do not align with this Code of Conduct.

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - For private concerns or questions

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** - All contributors listed
- **Release notes** - Significant contributions highlighted  
- **GitHub contributors** - Automatic contribution tracking

---

Thank you for contributing to Zonr! Together we can build the best terminal UI library for modern applications. 🚀