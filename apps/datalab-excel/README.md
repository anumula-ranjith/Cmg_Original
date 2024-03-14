# Overview

DataLab excel addin provides an interface directly within excel to query the DataLab graphql api.

# Getting Started

1. `yarn` - from repo root, install dependencies
1. `yarn nx run datalab-excel:serve` - start excel addin dev server
1. `yarn nx run datalab-excel:start-addin-desktop` - sideload addin to excel for desktop

# CI

Github Actions using Azure static web apps deploys to the following urls:

- https://witty-island-0ef27c110.4.azurestaticapps.net/ (stable environment, main branch)
- https://witty-island-0ef27c110-1.centralus.4.azurestaticapps.net (preview enviornments from pull request branch, where 1 is the PR #)
