const express = require("express");
const robot  = require("robotjs");
const path   = require("path");
const { exec } = require("child_process");

const app  = express();
const PORT = 3000;
const HOST = "0.0.0.0";

// Serve the web UI
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Helper: tap keys via RobotJS
function sendKey(key) {
  robot.keyTap(key);
}

// Explicit endpoints
app.get("/next",    (req, res) => { sendKey("right"); res.json({status:"ok",action:"next"}); });
app.get("/prev",    (req, res) => { sendKey("left");  res.json({status:"ok",action:"prev"}); });
app.get("/blackout",(req, res) => { sendKey("b");     res.json({status:"ok",action:"blackout"}); });

// Audio control endpoints
app.get("/audio/devices", (req, res) => {
  exec("SwitchAudioSource -a", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return res.status(500).json({ status: "error", message: error.message });
    }
    
    const devices = stdout.split("\n")
      .filter(device => device.trim().length > 0)
      .map(device => device.trim());
    
    // Get current device
    exec("SwitchAudioSource -c", (err, currentDeviceOutput) => {
      const currentDevice = err ? "" : currentDeviceOutput.trim();
      res.json({ 
        status: "ok", 
        devices,
        currentDevice
      });
    });
  });
});

app.post("/audio/switch", (req, res) => {
  const { device } = req.body;
  
  if (!device) {
    return res.status(400).json({ status: "error", message: "Device name is required" });
  }
  
  exec(`SwitchAudioSource -s "${device}"`, (error) => {
    if (error) {
      console.error(`Error switching device: ${error}`);
      return res.status(500).json({ status: "error", message: error.message });
    }
    
    res.json({ status: "ok", action: "switch", device });
  });
});

// Volume control endpoints
app.get("/volume", (req, res) => {
  exec("osascript -e 'output volume of (get volume settings)'", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error getting volume: ${error}`);
      return res.status(500).json({ status: "error", message: error.message });
    }
    
    const volume = parseInt(stdout.trim());
    res.json({ status: "ok", volume });
  });
});

app.post("/volume/set", (req, res) => {
  const { volume } = req.body;
  
  if (volume === undefined || isNaN(volume) || volume < 0 || volume > 100) {
    return res.status(400).json({ status: "error", message: "Volume must be a number between 0 and 100" });
  }
  
  exec(`osascript -e 'set volume output volume ${volume}'`, (error) => {
    if (error) {
      console.error(`Error setting volume: ${error}`);
      return res.status(500).json({ status: "error", message: error.message });
    }
    
    res.json({ status: "ok", volume });
  });
});

// Listen on all interfaces
app.listen(PORT, HOST, () =>
  console.log(`▶  Server listening at http://${HOST}:${PORT}`)
);

