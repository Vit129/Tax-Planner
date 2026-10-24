#!/usr/bin/env bash
set -e

echo "Building Tax-Planner for production..."
npm run build

echo "Packaging dist/ directly to gh-pages branch..."
INDEX_FILE=$(mktemp -u)
export GIT_INDEX_FILE="$INDEX_FILE"

git --work-tree=dist add --all
TREE_ID=$(git write-tree)
rm -f "$INDEX_FILE"

COMMIT_ID=$(git commit-tree "$TREE_ID" -m "deploy: update GitHub Pages $(date +'%Y-%m-%d %H:%M:%S')")

echo "Pushing commit ${COMMIT_ID} to origin/gh-pages..."
git push origin "$COMMIT_ID":refs/heads/gh-pages --force

echo "Successfully deployed to https://vit129.github.io/Tax-Planner/"
