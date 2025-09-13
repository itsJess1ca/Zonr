## [1.2.1](https://github.com/itsJess1ca/Zonr-Core/compare/v1.2.0...v1.2.1) (2025-09-13)


### Bug Fixes

* configure release workflow to use RELEASE_PAT for repository rule bypass ([1a9b835](https://github.com/itsJess1ca/Zonr-Core/commit/1a9b8356c688ea3e443cc5aa21c21338f21dcccf))
* remove unsupported pnpm pack --dry-run from PR validation ([07a8a30](https://github.com/itsJess1ca/Zonr-Core/commit/07a8a302a62d5db30083010794a964cdbfa67266))
* resolve PR validation pipeline issues ([991aa72](https://github.com/itsJess1ca/Zonr-Core/commit/991aa7221c8eed9010464b16d2aa63847a4c9733))
* update README badges to reflect new package name @zonr-logs/core ([65be57b](https://github.com/itsJess1ca/Zonr-Core/commit/65be57b3a5d69fd412fd70a5da03fed5eac3f9fc)), closes [#2](https://github.com/itsJess1ca/Zonr-Core/issues/2)

# [1.2.0](https://github.com/itsJess1ca/Zonr/compare/v1.1.0...v1.2.0) (2025-09-13)


### Features

* change package name to @zonr-logs/core ([1841346](https://github.com/itsJess1ca/Zonr/commit/18413460d215fa00edd3b6c16ccedc97adcf4a6d))

# [1.1.0](https://github.com/itsJess1ca/Zonr/compare/v1.0.1...v1.1.0) (2025-09-13)


### Features

* add publishConfig for public npm package ([4b781eb](https://github.com/itsJess1ca/Zonr/commit/4b781eb5e5e4579e82101933bc00bce43c3a97cf))

## [1.0.1](https://github.com/itsJess1ca/Zonr/compare/v1.0.0...v1.0.1) (2025-09-13)


### Bug Fixes

* skip commitlint in CI environment ([1d6a452](https://github.com/itsJess1ca/Zonr/commit/1d6a45268aa46687f41b30367f3f248ba9ec7efa))

# 1.0.0 (2025-09-13)


### Bug Fixes

* correct workflow vs job naming and enhance summaries ([2628c3f](https://github.com/itsJess1ca/Zonr/commit/2628c3f159d9ca82b70a34d34613372b41a68e2a))
* disable husky hooks during semantic-release ([d7b33b5](https://github.com/itsJess1ca/Zonr/commit/d7b33b59b518c79bb1cc83a3152d2dedaa13d6dd))
* eliminate border/header flickering during content updates ([c2d09b0](https://github.com/itsJess1ca/Zonr/commit/c2d09b01097b787fc55454afcefe256363b402d4))
* npm authentication in release workflow ([2010f82](https://github.com/itsJess1ca/Zonr/commit/2010f82ddde1e5f0e1abf829cb7a11d349bd6841))
* override npm config path for semantic-release ([1724b32](https://github.com/itsJess1ca/Zonr/commit/1724b32ad64f05589af32801173929a99f62fe67))


### Features

* add automatic transport cleanup on process signals ([867bfd9](https://github.com/itsJess1ca/Zonr/commit/867bfd912ee37235518c42d45e027b49c6a7b9b7))
* add dynamic run-name for better release tracking ([957d3fc](https://github.com/itsJess1ca/Zonr/commit/957d3fc137a3cf4453c5a065b49eb834bcfeadef))
* add high-performance FileTransport with sonic-boom ([c05a5a0](https://github.com/itsJess1ca/Zonr/commit/c05a5a0ea61937afea044a78657672a75498a349))
* change package name to @zonr/core for monorepo structure ([e1d6d04](https://github.com/itsJess1ca/Zonr/commit/e1d6d049a4b148ae36513f5a1ef95520095f7415))
* enhance release workflow with dynamic titles and summaries ([359837c](https://github.com/itsJess1ca/Zonr/commit/359837cb288386854c6fb51304c7cffcb4813fc7))
* integrate transport instances into zone configuration ([70b5931](https://github.com/itsJess1ca/Zonr/commit/70b5931eeef3e075ad33d2e56e08a7a5d94bdfa0))

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
