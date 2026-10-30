#!/usr/bin/env bash
set -e

BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo "Deploy must run from main (current branch: ${BRANCH})." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Deploy requires a clean working tree." >&2
  exit 1
fi

git fetch origin main --tags
HEAD_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)
if [ "$HEAD_COMMIT" != "$REMOTE_COMMIT" ]; then
  echo "Local main differs from origin/main; synchronize before deploying." >&2
  exit 1
fi

VERSION=$(node -p "require('./package.json').version")
TAG_COMMIT=$(git rev-parse --verify "refs/tags/v${VERSION}^{commit}")
if [ "$TAG_COMMIT" != "$HEAD_COMMIT" ]; then
  echo "HEAD must have the matching v${VERSION} release tag before deploying." >&2
  exit 1
fi

gh release view "v${VERSION}" --json tagName >/dev/null

PINNED_SHARED_WORKTREE=0
if [ -n "${SHARED_PACKAGES_ROOT:-}" ]; then
  SHARED_REPO=$(cd "$(dirname "$SHARED_PACKAGES_ROOT")" && pwd)
  PINNED_SHARED_WORKTREE=1
else
  SHARED_REPO=$(cd .. && pwd)/My-Investment-Port
fi
SHARED_BRANCH=$(git -C "$SHARED_REPO" branch --show-current)
if [ -n "$(git -C "$SHARED_REPO" status --porcelain)" ]; then
  echo "Shared My-Investment-Port packages require a clean working tree before deploying." >&2
  exit 1
fi
SHARED_COMMIT=$(git -C "$SHARED_REPO" rev-parse HEAD)
if [ -f release-manifest.json ]; then
  EXPECTED_SHARED=$(node -p "require('./release-manifest.json').sharedCommit")
  if [ "$EXPECTED_SHARED" != "$SHARED_COMMIT" ]; then
    echo "Release expects shared packages at ${EXPECTED_SHARED}, found ${SHARED_COMMIT}." >&2
    exit 1
  fi
fi
if [ "$PINNED_SHARED_WORKTREE" -eq 0 ]; then
  if [ "$SHARED_BRANCH" != "main" ]; then
    echo "Shared My-Investment-Port packages must be on main before deploying." >&2
    exit 1
  fi
  git -C "$SHARED_REPO" fetch origin main
  SHARED_REMOTE=$(git -C "$SHARED_REPO" rev-parse origin/main)
  if [ "$SHARED_COMMIT" != "$SHARED_REMOTE" ]; then
    echo "My-Investment-Port main differs from origin/main; synchronize shared packages before deploying." >&2
    exit 1
  fi
fi

echo "Building Tax-Planner for production..."
npm run build
printf '{"version":"%s","commit":"%s","sharedCommit":"%s"}\n' "$VERSION" "$HEAD_COMMIT" "$SHARED_COMMIT" > dist/deploy-info.json

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
