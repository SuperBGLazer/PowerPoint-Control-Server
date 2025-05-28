# PowerPoint Control Server (macOS only)

A web-based remote control for presentations with built-in audio and volume management capabilities.

## Features

- Control slides: next, previous, and blackout screen
- Switch audio output devices
- Control system volume
- Responsive web interface accessible from any device on the same network

## Requirements

- Node.js and npm
- macOS (for audio control features)
- `switchaudio-osx` utility for audio device management

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/SuperBGLazer/PowerPoint-Control-Server.git
   cd PowerPoint-Control-Server/
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Install the required audio management tool:
   ```
   brew install switchaudio-osx
   ```

## Running the Server

Start the server:

```
npm start
```

The server will run on port 3000. You can access the remote control interface by opening a browser and navigating to:
- `http://localhost:3000` (from the same machine)
- `http://[YOUR_IP_ADDRESS]:3000` (from any device on the same network)

## Usage

1. Open your presentation in PowerPoint, Keynote, Google Slides, or any application that accepts keyboard navigation
2. Start the PowerPoint Server
3. Access the web interface from your phone, tablet, or another computer
4. Control your presentation:
   - Tap "Next" or "Prev" to navigate through slides
   - Use "Blackout" to temporarily hide your presentation
   - Control your audio output device and system volume

## Audio Control

The audio control section allows you to:
- View and switch between available audio output devices
- Adjust system volume
- Quickly increase/decrease volume in 10% increments

## Notes

- The server uses RobotJS to simulate keyboard presses
- For audio device switching, ensure `switchaudio-osx` is installed
- Volume control uses macOS's AppleScript functionality
- The server only runs on MacOS
