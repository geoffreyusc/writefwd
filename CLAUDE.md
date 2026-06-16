# writefwd — Claude Code Instructions

## Auto-deploy
After every completed task, always:
1. git add .
2. git commit with a clear descriptive message
3. git push

The site is hosted on Netlify at writefwd.com. It auto-deploys on every push to main. No manual steps needed.

## Project structure
- index.html — landing page
- write/index.html — the writing app
- CLAUDE.md — these instructions

## Stack
- Plain HTML/CSS/JS — no build step, no framework
- Netlify hosting — auto-deploys on every push to main
- GitHub repo: git@github.com:geoffreyusc/writefwd.git

## Rules
- After every task: git add . && git commit && git push
- Never change A/B testing logic unless explicitly asked
- Never change layout or grid unless explicitly asked
- Never change copy unless explicitly asked
- Always make surgical changes — touch only what's needed
- Confirm what was changed after every task

## A/B test
Two variants running on the landing page:
- Variant A: dark demo panel + typographic headline
- Variant B: light demo panel + emotional headline
Variant assigned randomly on first visit via sessionStorage.
Primary metric: click_begin_session rate per variant.
Do not touch this logic unless explicitly asked.
