# 🛠️ AURA Team Git Pulling Guide

This guide outlines the steps for team members to sync their local development workspaces with the latest changes pushed to the central repository.

---

## 📥 How to Pull the Latest Updates

To sync your local workspace with the latest dashboard UI changes, transparent logo, and route-based skeleton loaders, follow these steps in your terminal:

### Step 1: Fetch all remote updates
Before pulling, fetch the latest references and branches from the remote repository without merging them yet:
```bash
git fetch origin
```

### Step 2: Ensure you are on the `main` branch
Make sure you are on the local branch that you want to update:
```bash
git checkout main
```

### Step 3: Pull and merge the updates
Pull the latest commits from the remote `main` branch into your local branch:
```bash
git pull origin main
```

*(If you are already on `main` and tracking is set up, running `git pull` will also work).*

---

## 💡 Troubleshooting unrelated histories
If you receive the error `fatal: refusing to merge unrelated histories` during a pull, it means your local repository and remote repository have different history roots. You can resolve this by running:

```bash
git pull origin main --allow-unrelated-histories
```

If there are any merge conflicts, resolve them (e.g. by selecting `ours` or `theirs` for files like `README.md`), stage the resolved files using `git add`, and finalize the merge by running `git commit`.
