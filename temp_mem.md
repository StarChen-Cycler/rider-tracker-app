# Important Reminders for Claude Code Sessions

## Git Commit Protocol
- Before making any modifications to the project, I will remind you to commit your current work
- I will provide the git command lines for you to run in a separate command window
- I will NOT commit directly to avoid issues with wrong directories

## Typical Git Commands I'll Suggest:
```bash
# Check current status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Description of changes made"

# Push to remote (if needed)
git push origin branch-name
```

## Project Context
- Working on Rider Tracker App (Nuxt 3 + Vue 3 + TypeScript)
- Mobile-first GPS tracking application with Amap integration
- Currently migrating from Supabase to MemFire Cloud
- Main directory: rider-tracker-app/

## Key Reminders
1. Always check current working directory before file operations
2. Prefer editing existing files over creating new ones
3. Follow the composable architecture pattern for Vue 3 business logic
4. Maintain mobile-first design principles
5. Ensure HTTPS compatibility for geolocation APIs
6. Respect development vs production mode differences