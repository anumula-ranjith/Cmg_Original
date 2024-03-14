# Workspace Configs

There are several common configurations and scripts for workspaces. Some examples of shared configuration are typescript, babel, eslint, prettier, and jest. Some examples of shared scripts are for building and testing.

## Directory structure

The child directories here store configuration for different types of workspace configs.

### /lib

Common configuration for packages that, when built, output javascript and other resources that can be consumed in other packages. This is different from our SPA workspaces that do not output consumable modules.

### /spa

Fortunately, create-react-app gives us most configuration out of the box. It's likely we'll end up with some custom configuration or complex scripts, as CRA and our usage of it grows. This directory also exists as a means to put further emphasis on `/lib` being for building non-runnable library packages.
