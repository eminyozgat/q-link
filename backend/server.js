const express = require("express");
const cors = require("cors");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 3000;
const frontendDir = path.join(__dirname, "..");

function getLanIpv4Address() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const [name, addresses] of Object.entries(interfaces)) {
    for (const address of addresses || []) {
      if (address.family !== "IPv4" || address.internal) continue;
      if (address.address.startsWith("169.254.")) continue;
      candidates.push({ name, address: address.address });
    }
  }
  const wifi = candidates.find(candidate => /wi-?fi|wireless|wlan/i.test(candidate.name));
  if (wifi) return wifi.address;
  const privateLan = candidates.find(candidate =>
    candidate.address.startsWith("10.") ||
    candidate.address.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(candidate.address)
  );
  if (privateLan) return privateLan.address;
  if (candidates[0]) return candidates[0].address;
  return "localhost";
}

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDir));

app.get("/api/network-info", (req, res) => {
  const host = getLanIpv4Address();
  res.json({
    host,
    port: PORT,
    baseUrl: `http://${host}:${PORT}`
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  const host = getLanIpv4Address();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Phone/LAN URL: http://${host}:${PORT}`);
});
