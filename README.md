# p5.js Collaborative Drawing

A real-time collaborative drawing canvas built with p5.js and Socket.IO. Draw with your mouse and see other users' drawings appear in real-time!

## What it does

- Draw on a shared canvas by clicking and dragging
- Your drawings appear in dark gray
- Other users' drawings appear in red
- Console logs when new users join
- Drawing speed affects brush size (faster = bigger circles)

## Running Locally

```bash
npm install
npm start
```

Open http://localhost:3000 in multiple browser tabs to see collaborative drawing in action!

## Deploying to CodeSandbox

### Option 1: Import from GitHub
1. Go to https://codesandbox.io
2. Click "Create" → "Import from GitHub"
3. Paste the repository URL
4. Select the `p5-drawing` folder

### Option 2: Manual Upload
1. Go to https://codesandbox.io
2. Create a new sandbox (Node.js template)
3. Upload these files:
   - `server.js`
   - `index.html`
   - `package.json`
4. Click "Run"
5. Open the preview URL in multiple browser tabs to test collaborative drawing

### CodeSandbox Configuration

CodeSandbox automatically:
- Installs dependencies (`express`, `socket.io`)
- Runs `npm start` (which executes `node server.js`)
- Exposes the server on the preview URL
- Sets `process.env.PORT` automatically

**Important:** The server uses `process.env.PORT` so it works on any hosting platform.

## How It Works

### Server Side (server.js)

The server acts as a centralized relay (not an echo server):

```javascript
io.on('connection', (socket) => {
    // Broadcast join notification to ALL users
    io.emit('hello!');

    // Relay drawing to everyone EXCEPT the sender
    socket.on('iamdrawing', (x, y, radius) => {
        socket.broadcast.emit('iamdrawing', x, y, radius);
    });
});
```

**Key difference from echo server:**
- Echo server: Reflects messages back to all rooms/sketches with same ID
- Centralized server: Only broadcasts to users connected to THIS server
- Better control: Track user count, validate data, add game logic

### Client Side (p5.js sketch in index.html)

```javascript
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    // Listen for other users' drawings
    socket.on('iamdrawing', someoneIsDrawing);

    // Listen for join notifications
    socket.on('hello!', someoneJoined);

    // Announce presence
    socket.emit('hello!');
}

function draw() {
    if (mouseIsPressed && (mouseX !== pmouseX || mouseY !== pmouseY)) {
        // Draw locally
        noStroke();
        fill(30, 30, 30, 90);
        var radius = Math.abs(mouseX - pmouseX) / 3 + Math.abs(mouseY - pmouseY) / 3;
        ellipse(mouseX, mouseY, radius, radius);

        // Send to server
        socket.emit('iamdrawing', mouseX, mouseY, radius);
    }
}

function someoneIsDrawing(x, y, r) {
    noStroke();
    fill(255, 0, 0, 90); // Red for others
    ellipse(x, y, r, r);
}
```

## Key Features

### 1. Speed-Based Brush Size
```javascript
var radius = Math.abs(mouseX - pmouseX) / 3 + Math.abs(mouseY - pmouseY) / 3;
```
Faster mouse movement = bigger circles

### 2. Color Coding
- **Dark gray (30, 30, 30)** - Your own drawings
- **Red (255, 0, 0)** - Other users' drawings

### 3. Alpha Transparency
```javascript
fill(30, 30, 30, 90); // 90/255 alpha = semi-transparent
```
Creates nice overlapping effects

### 4. Only Draw When Moving
```javascript
if (mouseIsPressed && (mouseX !== pmouseX || mouseY !== pmouseY))
```
Prevents sending duplicate events when mouse is stationary

## Differences from Echo Server Example

| Feature | Echo Server | Centralized Server |
|---------|-------------|-------------------|
| Connection | `$OP.getEchoServerURL(id)` | `window.location.origin` |
| Server control | None | Full (can add validation, limits) |
| User tracking | No | Yes (`userCount` variable) |
| Deployment | OpenProcessing only | Any platform (CodeSandbox, Heroku, etc.) |
| Broadcasting | To all sketches with same ID | Only to your server's users |

## Files

- `server.js` - Express + Socket.IO server (34 lines)
- `index.html` - p5.js sketch with Socket.IO client (86 lines)
- `package.json` - Dependencies and scripts

## Testing Multiplayer

1. Start the server with `npm start`
2. Open http://localhost:3000 in 2-3 browser tabs
3. Draw in one tab with your mouse
4. See it appear in red in the other tabs
5. Draw in another tab - see it in red in the first tab
6. Check console for "New user joined!" messages

## Possible Enhancements

Want to extend this project? Try adding:

- **Clear canvas button** - Emit event to reset all clients
- **Color picker** - Let users choose their own color
- **Brush size slider** - Control thickness independently
- **Undo functionality** - Store drawing history
- **Save/export** - Download canvas as image
- **User names** - Display who's drawing what
- **Drawing modes** - Lines, rectangles, etc.
- **Persistent canvas** - Store drawings on server for late joiners

## p5.js Resources

- p5.js Reference: https://p5js.org/reference/
- p5.js Examples: https://p5js.org/examples/
- Socket.IO Documentation: https://socket.io/docs/

## Related Examples

- `../chat/` - Text-based real-time communication
- `../LBF/` - Another p5.js multiplayer example (fireflies)
- `../Super-Simple-Socket/` - Minimal Socket.IO example
