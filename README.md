# MetadataPRO Development Setup & Documentation
## Prerequisites
The scaffolding of the project is cloned from https://github.com/lazercaveman/nuxt-starter.

Required Dependencies:

- Node v22.17.0 (use nvm for version management)
- Yarn >4.6.0
- Homebrew (macOS users)

VS Code Extensions:

- Vue (Official) - Essential for Vue 3 Composition API support
- ESLint
- Important: Disable the built-in TypeScript and JavaScript extension in workspace settings (search @builtin typescript and javascript in Extensions) to avoid conflicts with Vue tooling

## Installation

Ensure above dependencies are correctly configured in your shell's $PATH, ensure shell is loaded, e.g: `source ~/.zshrc`

Node version is tracked in .nvmrc, to load run `nvm use`.

Install Dependencies:
`yarn install`

Start Development Server:
`yarn dev`

## Edit .env with your Supabase credentials

Add the below environment variables from your superbase project to `.env`.

```SUPABASE_URL={{your_project_url}} SUPABASE_KEY={{your_project_key} SUPABASE_SERVICE_ROLE_KEY={{your_project_service_role_key}}```

## Install Supabase:

Install the supabase CLI:

`brew install supabase/tap/supabase`

Then login to your account: 

`supabase login`

Then finally you'll need to link to your project: 

`supabase link --project-ref <your-project-ref>`

## Migration Workflow
### Creating New Migrations:

Changes to the database need to be tracked as SQL script migrations. 

`supabase migration new <migration_name_0001>`

This creates a new file in /supabase/migrations/ where you add your SQL changes.

### Migration Best Practices:

Sequential Naming: Use incremental numbering (0001, 0002, etc.)

Descriptive Names: 20241125000001_add_artist_validation_system.sql

Atomic Changes: Each migration should handle one logical change

Reversible: Always consider rollback scenarios
