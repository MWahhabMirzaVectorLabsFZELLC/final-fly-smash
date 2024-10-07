# Ant-Smasher

Ant-Smasher is a fun and interactive Ant-clicking game built with React.js. Players have 30 seconds to click on falling ants, avoid bombs, and freeze the ants to score points. The game keeps track of high scores and invites players to bring friends for more tries if they run out of chances.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Falling Ants:** Players click falling apples to earn points.
- **Bombs & Freezers:** Players need to avoid bombs and can freeze the apples for short periods.
- **Score Tracking:** Keeps track of scores and displays them in the navigation bar.
- **Game Timer:** Players have 30 seconds per game session.
- **Leaderboard:** Displays username, score, and ranking.
- **Invite Feature:** After 5 game attempts, players can invite friends for more tries.
- **Cool animations** for falling apples, bombs, and freezing action.

## Screenshots

### Gameplay

![Gameplay](./SS/1.png)

### Tasks

![Tasks](./SS/2.png)

### User Profile

![User Profile](./SS/3.png)

### Spinner

![Spinner](./SS/4.png)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ant-smash.git
```

2. Navigate to the project directory:

```bash
cd ant-smash
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The game will be available at `http://localhost:5173` by default.

## Usage

1. **Start the Game:** Once you land on the homepage, click on "Start Game" to begin.
2. **Click Ants:** Click on the falling apples to earn points.
3. **Avoid Bombs:** Clicking on bombs will deduct points and remove elements from the screen.
4. **Use Freezers:** Clicking on freezers will stop apples for 2 seconds.
5. **Leaderboard:** Track your score and rank in the navigation bar.
6. **Invite Friends:** If you've played 5 rounds, invite a friend to get more tries.

## Game Rules

- **Timer:** Each game lasts 30 seconds.
- **Points:** Each Ant clicked gives 1 point.
- **Bombs:** Each bomb clicked deducts 5 points.
- **Freezer:** Freezer stops all apple movement for 2 seconds.
- **Play Limit:** Players can only play 5 rounds before needing to invite a friend for more tries.

## Project Structure

```
.
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── Ant.js
│   │   ├── Bomb.js
│   │   ├── Freezer.js
│   │   ├── GameHeader.js
│   │   ├── PointsMessage.js
│   │   ├── PlayAgainPrompt.js
│   │   ├── CooldownTimer.js
│   │   └── NavBar.js
│   ├── pages
│   │   └── GamePage.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## Technologies Used

- **React.js:** Front-end framework used to build the game.
- **JavaScript (ES6+):** Core language for building components and game logic.
- **CSS:** Styling for game elements and layout.
- **Bootstrap:** Styling for game elements and layout.
- **HTML5:** Markup for structuring the app.
- **React Hooks:** State management and side effects.
- **LocalStorage:** For storing scores and games played.

## Contributing

Contributions are welcome! Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a pull request.

Please ensure your code adheres to the project’s coding guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
