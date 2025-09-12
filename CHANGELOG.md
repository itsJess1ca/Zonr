Lets e# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

## [Unreleased]

### Features
- **core**: Zone-based terminal UI system with custom ANSI renderer
- **layout**: Dynamic layout system with automatic row grouping and intelligent space distribution
- **transport**: File transport with high-performance sonic-boom implementation
- **lifecycle**: Automatic signal handling for graceful transport cleanup
- **api**: Clean top-level convenience methods (addZone, getZone, etc.)
- **renderer**: Differential rendering with content-only updates to prevent flickering
- **resize**: Cross-platform terminal resize support with Windows compatibility workarounds
- **emoji**: Proper wide character and Unicode variation selector handling

### Performance
- **rendering**: Differential updates only redraw changed zones
- **transport**: High-volume logging optimizations with sync mode and larger buffers
- **layout**: Accurate innerWidth calculations for optimal content sizing

### Developer Experience
- **typescript**: Complete type safety with strict ANSIColor constraints
- **testing**: Comprehensive test suite with 37 passing tests
- **ci/cd**: Full quality pipeline with lint, format, test, and build stages
- **docs**: Complete documentation with demo gallery and contributor guidelines
- **conventional**: Conventional commits with semantic-release automation