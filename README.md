#Node.js File Manager CLI

A simple command-line file manager built using Node.js. Supports basic file and directory operations like listing, creating, deleting, reading, and renaming files and folders.

---

##Features

- `list [dir]` — List all files and folders in the given directory (defaults to current)
- `cd <dir>` — Change the current working directory
- `create <filename>` — Create a new empty file
- `read <filename>` — Read and display the contents of a file
- `delete <name>` — Delete a file or directory (recursive)
- `rename <old> <new>` — Rename a file or folder
- `mkdir <dirname>` — Create a new directory
- `exit` — Exit the CLI

---

##Usage

```bash
npm run index.js
