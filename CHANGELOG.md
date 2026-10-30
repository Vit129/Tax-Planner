# Changelog

Notable changes to Tax-Planner are documented here. This file follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.3] - 2026-10-30

### Fixed
- Align release and Pages deployment workflow ([`59ec3ab`](https://github.com/Vit129/Tax-Planner/commit/59ec3ab5c2cdcc08d9614c6fd1e62041aac67d46))
- Open tax summary when inputs exist ([`14d7640`](https://github.com/Vit129/Tax-Planner/commit/14d764073f8437c459917292e055f40ba6e4d54a))

## [1.4.2] - 2026-10-30

### Fixed
- Restore income category tabs ([`ab4e4e5`](https://github.com/Vit129/Tax-Planner/commit/ab4e4e52339e0b8fd60930ac3ab53a086a4bdede))

## [1.4.1] - 2026-10-30

### Added
- Complete mixed income tax planning ([`99b8840`](https://github.com/Vit129/Tax-Planner/commit/99b88403ee10c2df6d0e30c71d622ac0ec847160))

## [1.4.0] - 2026-10-29

### Added
- Support soft power art and social enterprise deductions ([#4](https://github.com/Vit129/Tax-Planner/pull/4)) ([`431b338`](https://github.com/Vit129/Tax-Planner/commit/431b33813da41b8ccc2fb92dc79f2acf2b9cf0dc))

## [1.3.0] - 2026-10-29

### Added
- Support solar rooftop deduction up to 200,000 for tax year 2569 ([`939e798`](https://github.com/Vit129/Tax-Planner/commit/939e7985f8ee6cc5d91dbfff5fbd0a4b007526da))

## [1.2.0] - 2026-10-29

### Added
- Add interactive start.js CLI workflow and isolated git plumbing deploy script ([`6d6fc51`](https://github.com/Vit129/Tax-Planner/commit/6d6fc51a02d5c8064f7d2e213c016d769b8bc30a))
- Add taxLogicScenario Playwright API and UI test suite with 14 golden scenarios ([`9d64758`](https://github.com/Vit129/Tax-Planner/commit/9d647585c42001a02303e4b0ded010e838da4e8c))
- Add the easy tax adapter and tests with an invented fixture ([`8336076`](https://github.com/Vit129/Tax-Planner/commit/833607671d63b6ea5e3e58447fed0aa18fdb6fcb))
- Use the shared TaxEasyApp wizard through the adapter ([`25b27dc`](https://github.com/Vit129/Tax-Planner/commit/25b27dc666defbb3a654afedc632f3f632db3b13))
- Use the shared pool card, tax waterfall and pension/NSF tiles ([`d770b23`](https://github.com/Vit129/Tax-Planner/commit/d770b231076d22756e542737863f549edafcd145))

### Changed
- Align taxLogicScenario to AODD-AISDLC Playwright QA standard with Page Object and Fixture ([`20a5db0`](https://github.com/Vit129/Tax-Planner/commit/20a5db0482dad6fe9531527b5d65b6e5585d204d))

### Documentation
- Add comprehensive PRODUCTS, ARCHITECTURE, DESIGN and update README ([`7fbdc28`](https://github.com/Vit129/Tax-Planner/commit/7fbdc282c1ced477704e24775e9d5afa3b605ef1))
- Add live GitHub Pages URL and deploy npm script ([`dd8ae8d`](https://github.com/Vit129/Tax-Planner/commit/dd8ae8d86c82ac44425a005bf3d22c8951c17d83))
- Record architecture guard token import requirement ([`99e1c0a`](https://github.com/Vit129/Tax-Planner/commit/99e1c0a3f8f172916b405fc7002d3d94849ab665))
- Record 2569 SSO ceiling rule (875/mo, 10,500/yr) ([`5d7e0b5`](https://github.com/Vit129/Tax-Planner/commit/5d7e0b5ef072f2c1516d80aaab72f5fd7a4f89cc))
- Consolidate PRODUCTS.md into canonical PRODUCT.md with In/Out of Scope ([`75a7fb5`](https://github.com/Vit129/Tax-Planner/commit/75a7fb558b37ea9a6c3fc8c854f4d8be9acae9be))
- Add Claude and Antigravity as contributors ([`6cc8c2a`](https://github.com/Vit129/Tax-Planner/commit/6cc8c2a8bf24fd1ac6daad8bec2e4ea9bc6b93ea))
- Add All-Contributors avatar grid and update copyright notice ([`32bf36e`](https://github.com/Vit129/Tax-Planner/commit/32bf36e64055565d00787b8597837e0c92cd5d9b))
- Update copyright notice with co-authors ([`a6bf34c`](https://github.com/Vit129/Tax-Planner/commit/a6bf34cc2422c52c6b2b4241fe11533b64a26e21))

### Fixed
- Import TYPOGRAPHY in SalarySection, add favicon, and add import guard test ([`79351a9`](https://github.com/Vit129/Tax-Planner/commit/79351a949c2452612812449633e3c3a7305f36b0))
- Align Social Security ceiling to 2569 law (875/mo, 10,500/yr cap) ([`9691f20`](https://github.com/Vit129/Tax-Planner/commit/9691f20d84588f36bd0935748853da81738fe668))
- Shorten the month detail card so it reads at a glance ([`ad62226`](https://github.com/Vit129/Tax-Planner/commit/ad622264e64910926909f108c52b8b3a7b046f08))

## [1.1.0] - 2026-10-24

### Added
- Initial commit for Tax-Planner with logic/ui separation and vitest suite ([`b29a720`](https://github.com/Vit129/Tax-Planner/commit/b29a720a9595493f1d8ffb0b83f0af9be3abe975))
- Add integrated 12-month calendar view with monthly breakdown ([`2feb35e`](https://github.com/Vit129/Tax-Planner/commit/2feb35e262b15ab78493adf36541460ae48c2ae6))
- Separate logic, ui, config tokens, shared components and set bright cream default ([`c4c7266`](https://github.com/Vit129/Tax-Planner/commit/c4c72664886fff9597c7ef6d0a6ad67507d50c8f))
- Integrate @vit129 shared packages and bump version to v1.1.0 ([`75a6039`](https://github.com/Vit129/Tax-Planner/commit/75a6039a174a7e861b18f54ffb82db82b1baff84))

### Documentation
- Add UI mockup and stack/logic/UI decision page ([`e51d93b`](https://github.com/Vit129/Tax-Planner/commit/e51d93b74e803d028e039f23da19da5a4ef8c4fc))
- Update tax mockup to match latest Tax page design ([`e8df47c`](https://github.com/Vit129/Tax-Planner/commit/e8df47cd24147863600c7b0ddb7cad2dcb0337f9))