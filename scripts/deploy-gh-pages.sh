#!/usr/bin/env bash
set -e

echo "Building Tax-Planner for production..."
npm run build

CURRENT_BRANCH=$(git branch --show-current)
echo "Deploying dist/ to gh-pages branch from ${CURRENT_BRANCH}..."

git checkout --orphan gh-pages-deploy
git reset
git --work-tree dist add --all
git --work-tree dist commit -m "deploy: update GitHub Pages $(date +'%Y-%m-%d %H:%M:%S')"
git push origin gh-pages-deploy:gh-pages --force
git checkout -f "${CURRENT_BRANCH}"
git branch -D gh-pages-deploy

echo "Successfully deployed to https://vit129.github.io/Tax-Planner/"
