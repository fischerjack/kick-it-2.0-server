
let map = new Map(1000, 300);

let players = [new Player(map.canvasWidth / 8 * 3, 180, 38, 39, 37, 191, 'img/goten-sprite-compressed.png'), 
               new Player(map.canvasWidth / 8 * 4.5, 180, 87, 68, 65, 70, 'img/c17super-sprite-compressed.png')];

let arena = new ArenaController(0.9, 0.25, players, map);

window.addEventListener('load', () => {
  arena.update();
});

