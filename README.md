Ball Bounce
Zachary Winkel

Controls 
q, e, to rotate paddle
<,a,d,> to move 


**Important:** The server uses `process.env.PORT` so it works on any hosting platform.

## How It Works

### Server Side (server.js)

The server acts as a centralized relay (not an echo server):


**Key difference from echo server:**
- Echo server: Reflects messages back to all rooms/sketches with same ID
- Centralized server: Only broadcasts to users connected to THIS server
- Better control: Track user count, validate data, add game logic

### Client Side (p5.js sketch in index.html)



## p5.js Resources

- p5.js Reference: https://p5js.org/reference/
- p5.js Examples: https://p5js.org/examples/
- Socket.IO Documentation: https://socket.io/docs/

## Related Examples

- `../chat/` - Text-based real-time communication
- `../LBF/` - Another p5.js multiplayer example (fireflies)
- `../Super-Simple-Socket/` - Minimal Socket.IO example

