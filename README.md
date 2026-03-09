# 🐦 Bird Watching - A Pixel Art Browser Game

Spot birds from your window, drink coffee to stay energized, and fill your notebook with all 10 bird species!

![Pixel Art Bird Game](https://img.shields.io/badge/style-pixel%20art-brightgreen)
![Browser Game](https://img.shields.io/badge/type-browser%20game-blue)
![JavaScript](https://img.shields.io/badge/tech-html%2Fcss%2Fjs-yellow)

## 🎮 About the Game

You're sitting at a cozy table near a window, with a coffee maker, a notebook, and binoculars. Outside, birds fly between the trees. Your goal is to spot all 10 different bird species and record them in your notebook.

## 🎯 How to Play

1. **Spot Birds** - Click on birds through the window to record them in your notebook
2. **Use Binoculars** - Click the binoculars to zoom in and see distant birds more clearly
3. **Drink Coffee** - Click the coffee maker to refill your stamina when it gets low
4. **Check Your Notebook** - Click the notebook to see which birds you've found
5. **Win** - Find all 10 different birds to complete your collection!

## ✨ Features

- **Pixel Art Style** - Retro 8-bit aesthetic with custom assets
- **10 Unique Birds** - Robin, Cardinal, Blue Jay, Goldfinch, Hummingbird, Owl, Eagle, Duck, Swan, and Peacock
- **Stamina System** - Manage your energy with coffee breaks
- **Binoculars Mode** - Zoom in to spot distant birds with a round lens effect
- **Notebook Tracking** - Lined paper notebook that fills up as you discover birds
- **Responsive Design** - Works on different screen sizes

## 🛠️ Tech Stack

- **HTML5** - Game structure
- **CSS3** - Pixel art styling, animations, and effects
- **JavaScript (ES6+)** - Game logic and interactivity
- **No external dependencies** - Pure vanilla JavaScript!

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bird-watching.git
cd bird-watching
```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click → "Open with" → Your browser, or
   - Use a local server (optional):
   ```bash
   # Python 3
   python -m http.server 8000
   # Node.js
   npx serve
   ```

3. Play and enjoy! No build process required.

## 🎮 Game Controls

| Action | How |
|--------|-----|
| Spot a bird | Click on a bird in the window |
| Toggle binoculars | Click the binoculars |
| Drink coffee | Click the coffee maker |
| Open notebook | Click the notebook |
| Restart game | Click "Play Again" after winning |

## 📊 Game Flow

```mermaid
flowchart TD
    Start([Start Game]) --> Spawn[Birds spawn in trees]
    Spawn --> Wait[Wait for player action]

    Wait -->|Click bird| Spot{Already found?}
    Wait -->|Click binoculars| Binoculars[Toggle zoom view]
    Wait -->|Click coffee| Coffee[Restore stamina]
    Wait -->|Click notebook| Notebook[View collection]

    Binoculars --> Wait
    Coffee --> Wait
    Notebook --> Wait

    Spot -->|Yes| Already[Shake animation]
    Spot -->|No| Found[Add to notebook!]

    Already --> Wait
    Found --> Check{All 10 found?}

    Check -->|No| Wait
    Check -->|Yes| Win([🎉 You Win!])
    Win --> Restart[Click to play again]
    Restart --> Start
```

## 📂 Project Structure

```
bird-watching/
├── index.html          # Main HTML structure
├── style.css           # Pixel art styling
├── game.js             # Game logic
├── assets/             # Game assets
│   ├── background.png  # Window view with trees
│   ├── coffee-maker.png
│   ├── binoculars.png
│   └── notebook.png
└── README.md           # This file
```

## 🎨 Customization

Want to add your own assets? Place your pixel art images in the `assets/` folder:

- **background.png** - Recommended: 900×400px
- **coffee-maker.png** - Recommended: ~100×100px
- **binoculars.png** - Recommended: ~60×60px
- **notebook.png** - Recommended: ~250×180px

## 🐦 Bird List

| # | Bird | Emoji |
|---|------|-------|
| 1 | Robin | 🐦 |
| 2 | Cardinal | 🔴 |
| 3 | Blue Jay | 🔵 |
| 4 | Goldfinch | 🟡 |
| 5 | Hummingbird | 🐝 |
| 6 | Owl | 🦉 |
| 7 | Eagle | 🦅 |
| 8 | Duck | 🦆 |
| 9 | Swan | 🦢 |
| 10 | Peacock | 🦚 |

## 🌟 Credits

- **Game Design & Development** - Vihtori
- **Pixel Art Assets** - Vihtori
- **Font** - [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by Code New Roman

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add new bird species

## 📮 Contact

Have questions or feedback? Open an issue on GitHub!

---

**Made with ❤️ and ☕ for bird lovers everywhere**
