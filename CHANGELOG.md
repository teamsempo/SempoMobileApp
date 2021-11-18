# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Remove console.* statements from adb logcat

## [1.1.18] - 2021-04-29
### Added
- a11y updates
- Share wallet address via SMS, Email, Social etc.

### Fixed
- PIN Backwards compatibility 

### Changed
- Translation
- Password to PIN storage

## [1.1.15] - 2021-04-29
### Added
- Disable Transfer Card
- Dynamic card location loading

## Fixed
- Save pending transfer cache on logout
- Backup navigation

## [1.1.5] - 2020-10-22
### Added
- More resilient to nfc scanning failures
- More aggressive retrying to resolve pending transactions (now attempts every time the homescreen is refreshed)

## [1.1.2] - 2020-10-22
### Added
- Adding Card Sync Scanner to app

### Fixed
- Improving language translations

## [1.1.1] - 2020-10-22
### Added
- Making it easier to log in with any phone number

## [1.0.2] - 2020-07-01
### Fixed
- Bug fixes

## [1.0.1] - 2020-02-03
### Added
- Self sign up
- Multi-currency

### Fixed
- Multiple bug fixes

## [0.1.4] - 2019-07-16
### Added
- Better performance in low connectivity environments

## [0.0.3] - 2019-04-02
### Added
- Uses a mifare ultralight EV2 to support transactions when there is only intermittent internet connections. Card has two one-way counters, storing amount loaded, and amount spent, to calculate the balance and prevent double spend. Caches transactions on the vendor's device until connectivity is restored.

## [0.1-base] - 2018-11-30
### Added
- Base release used in givecrypto for kurdistan

## [0.0.27] - 2018-11-01
### Added
- Redux Persist Clearing

[Unreleased]: https://github.com/teamsempo/SempoMobileApp/compare/v1.1.18..HEAD
[1.1.18]: https://github.com/teamsempo/SempoMobileApp/compare/v1.1.15...v1.1.18
[1.1.15]: https://github.com/teamsempo/SempoMobileApp/compare/v1.1.5...v1.1.15
[1.1.5]: https://github.com/teamsempo/SempoMobileApp/compare/v1.1.2...v1.1.5
[1.1.2]: https://github.com/teamsempo/SempoMobileApp/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/teamsempo/SempoMobileApp/compare/v1.0.2...v1.1.1
[1.0.2]: https://github.com/teamsempo/SempoMobileApp/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/teamsempo/SempoMobileApp/compare/v0.1.4...v1.0.1
[0.1.4]: https://github.com/teamsempo/SempoMobileApp/compare/v0.1.0...v0.1.4
[0.1.0]: https://github.com/teamsempo/SempoMobileApp/compare/v0.1-base...v0.1.0
[0.0.1-base]: https://github.com/teamsempo/SempoMobileApp/compare/v0.0.27...v0.1-base
[0.0.27]: https://github.com/teamsempo/SempoMobileApp/releases/tag/v0.0.27