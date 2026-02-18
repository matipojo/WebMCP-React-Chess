# React Chess with Model Context Protocol (MCP)

A chess game that exposes its tools via the [Model Context Protocol](https://modelcontextprotocol.io/), allowing AI assistants to play chess through `navigator.modelContext`.

## Live Demo

**[Play it on GitHub Pages](https://matipojo.github.io/WebMCP-React-Chess)**

> Requires [Chrome Canary](https://www.google.com/chrome/canary/) with `chrome://flags/#enable-webmcp-testing` enabled.

## MCP Tools

When `navigator.modelContext` is available, the app registers these tools that any AI assistant can call:

| Tool | Description |
|------|-------------|
| `get-board-state` | Returns all piece positions, current turn, and game status |
| `make-move` | Makes a move using notation like `"e2:e4"` |
| `get-possible-moves` | Lists legal moves for a piece at a given position |
| `restart-game` | Resets the board to the starting position |
| `promote-pawn` | Promotes a pawn to queen, rook, bishop, or knight |

### How it works

A single React hook (`src/hooks/useModelContextTools.ts`) registers all chess tools with `navigator.modelContext.provideContext()`. Each tool directly calls the game's state and actions — no wrappers, no globals, no indirection.

```
Referee component (game state)
    ↓ passes board + actions
useModelContextTools hook
    ↓ registers tools on
navigator.modelContext
    ↓ AI assistant calls tools
```

### Key files

- `src/hooks/useModelContextTools.ts` — The single hook that registers MCP tools
- `src/model-context-types.ts` — TypeScript types for `navigator.modelContext`
- `src/utils/chess-notation-utils.ts` — Converts chess notation (e.g. `"e2"`) to board coordinates

---

## Original Repo

---

This chess game is based on [React-Chess](https://github.com/szabolcsthedeveloper/React-Chess) by [@szabolcsthedeveloper](https://github.com/szabolcsthedeveloper).

![React Chess Game Preview](https://i.imgur.com/9aAIZKX.png)

## Features

- **Play Chess**: Challenge yourself with a game of chess, optimized for all levels.
- **Modern UI**: A clean and intuitive interface ensuring a delightful experience.
- **Responsive Design**: Enjoy the game on any device, desktop, tablet, or mobile.
- **TypeScript**: Strongly typed to enhance code quality and understandability.

## Getting Started

### Prerequisites

Before you begin, ensure you have the latest version of `npm` installed on your machine.

### Installation

1. Clone the repository:
```
git clone https://github.com/matipojo/React-Chess
```

2. Navigate to the project directory:
```
cd React-Chess
```

3. Install the project dependencies:
```
npm install
```

4. Start the development server:
```
npm start
```

Open http://localhost:3000 to view it in your browser.

## Usage

Move pieces by clicking and dragging them to the target square. The game enforces legal moves and highlights possible destinations.
