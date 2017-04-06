window.onload = function() {
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 38 && direction !== 'down') {
      direction = 'up';
    } else if (e.keyCode === 40 && direction !== 'up') {
      direction = 'down';
    } else if (e.keyCode === 37 && direction !== 'right') {
      direction = 'left';
    } else if (e.keyCode === 39 && direction !== 'left') {
      direction = 'right';
    }
  });


  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.height = 400;
  canvas.width  = 400;
  var snakeContainer = document.getElementsByClassName('snakeContainer')[0];
  snakeContainer.appendChild(canvas);
  document.getElementsByTagName("canvas")[0].style.background = '#aaaaaa'


  var score = 0;
  var highscore = 0;
  var direction = 'right';
  var snake = new Array(3);
  var active = true;
  var speed = 300;

  var map = new Array(40);
  for (var i = 0; i < map.length; i++) {
    map[i] = new Array(40);
  }


  map = placeTreat(map);
  map = placeSnake(map);
  drawGame();

  function outOfBounds(snakeHead) {
    if (snakeHead.x < 0 || snakeHead.x >= 40 || snakeHead.y < 0 || snakeHead.y >= 38) {
      return true;
    }
    return false;
  }

  function snakeEatingTreat (map, snakeHead) {
    return map[snakeHead.x][snakeHead.y] === 1
  }

  function growSnake(snake) {
    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
  }

  function setMapToSnakeGrowthOccupied(map, snake) {
    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
  }

  function setMapToSnakeOccupied(map, snake) {
    map[snake[0].x][snake[0].y] = 2;
  }

  function handleHighScore(score, highscore) {
    if (score > highscore) {
      return score;
    }else{
      return highscore;
    }
  }

  function drawGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = snake.length - 1; i >= 0; i--) {
        if (i === 0) {
          switch(direction) {
            case 'right': snake[0] = { x: snake[0].x + 1, y: snake[0].y }; break;
            case 'left': snake[0] = { x: snake[0].x - 1, y: snake[0].y }; break;
            case 'up': snake[0] = { x: snake[0].x, y: snake[0].y - 1 }; break;
            case 'down': snake[0] = { x: snake[0].x, y: snake[0].y + 1 }; break;
          }

          if ( outOfBounds(snake[0]) ) {
              showGameOver();
              return;
          }

          if ( snakeEatingTreat(map, snake[0]) ) {
              score += 10;
              map = placeTreat(map);

              growSnake(snake);
              setMapToSnakeGrowthOccupied(map, snake);

          } else if (map[snake[0].x][snake[0].y] > 1) {
              showGameOver();
              return;
          }

          setMapToSnakeOccupied(map, snake);
        }
        else {

          if (i === (snake.length - 1)) {
              map[snake[i].x][snake[i].y] = null;
          }

          snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
          map[snake[i].x][snake[i].y] = 2;
        }
    }


    drawSnakeEyes (snakeHead) {
      x = snakeHead.x;
      y = snakeHead.y;
      
      if ( direction === 'right' ) {

      }
    }

    drawMain();

    for (var x = 0; x < map.length; x++) {
      for (var y = 0; y < map[0].length; y++) {
        if (map[x][y] === 1) {

          var radgrad = ctx.createRadialGradient(10*x + 3, 10*y + 23, 1, 10*x + 5, 10*y + 25, 5);
            radgrad.addColorStop(0, '#FFFFFF');
            radgrad.addColorStop(0.9, 'red');
            radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');

          ctx.strokeStyle = 'darkred';

          ctx.beginPath();
          ctx.arc(10*x + 5, 10*y + 25 , 5, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = radgrad
          ctx.fill();
        }
        else if (map[x][y] === 2) {
          ctx.strokeStyle = 'darkgreen';
          ctx.strokeRect(x*10, y*10 + 20, 10, 10);
          ctx.fillStyle = 'green';
          ctx.fillRect(x*10, y*10 + 20, 10, 10);
        }
      }
    }
    if (active) {
      setTimeout(drawGame, speed - score);
    }
  }

  function drawMain() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';

    ctx.strokeRect(0, 20, canvas.width, canvas.height-20);

    ctx.font = '14px sans seriff';
    ctx.fillText('Score: ' + score, 2, 12);

    if (highscore !== 0) {
      ctx.fillText('High Score: ' + score, 255, 12);
    }
  }


  function placeTreat(map) {
    var randX = Math.floor(Math.random() * 35);
    var randY = Math.floor(Math.random() * 35);


    map[randX][randY] = 1;
    return map;
  }

  function placeSnake (map) {
    var x = Math.floor(Math.random() * 35) + 3;
    var y = Math.floor(Math.random() * 35) + 3;


    for (var i = 0; i < snake.length; i++) {
      snake[i] = { x: x-i, y: y }
      map[x-i][y] = 2;
    }
    return map;
  }

  function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    active = false;

    ctx.fillStyle = 'black';
    ctx.font = '16px helvetica';
    ctx.fillText('Game Over',((canvas.width/2) - (ctx.measureText('Game Over').width / 2)), 50);

    // var resetButton = document.getElementById("resetButton");

    highscore = handleHighScore(score, highscore)

    setTimeout(function() {


      score = 0;
      map = [];
      map = new Array(40);
      for (var i = 0; i < map.length; i++) {
        map[i] = new Array(40);
      }
      snake = new Array(3);
      map = placeTreat(map);
      map = placeSnake(map);

      active = true;
      drawGame();
    }, 1000)
  }
};
