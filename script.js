const blocks = 18;
const grid = document.getElementById('grid');
let gridDiv = ``
let fps = 25;
let frames = 0;
let food = {x: 15, y: 5}
let snake = {x: [15,14], y: [15,14]}
const food_audio = new Audio('./music/food.mp3');
const gameover = new Audio('./music/gameover.mp3');
const move = new Audio('./music/move.mp3');
const music = new Audio('./music/music.mp3');
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");
let dir = {x: 0, y: -1}
let HScore = 0;
let scorenum = 0;
if(localStorage.getItem("HighScore")){
     HScore = localStorage.getItem("HighScore");
     highScore.innerHTML = HScore;
}else{
    HScore = 0;
}

function contain(){
    if(frames % fps==0){
        let secondpart = {x: snake.x[1],y: snake.y[1]}
        snakefn(); 
        generateGrid();
        move.play();
        grid.innerHTML = gridDiv;
        gridDiv = ``
        frames = 0;
        if(gameoverfn(secondpart)) return
    }
    frames++;
    setTimeout(()=>{},20)
    window.requestAnimationFrame(contain);
}
function generateGrid(){
    let head = true;
    let dark = false;
    let color = "grid-dark";
    for(let i = 0;i<blocks;i++){
        for(let j = 0;j<blocks;j++){
            dark ? color = "grid-dark" : color = "";
            if(snake.x.includes(j) && snake.y.includes(i) && compareNums(snake.y,snake.x,i,j)){
                if(head && snake.x[0] == j && snake.y[0] == i){
                    gridDiv+=`<div class="grid-head"></div>`;
                    head = !head;
                }else{
                    gridDiv+=`<div class="grid-snake"></div>`
                }
            }else if(i == food.y && j == food.x){
                gridDiv+=`<div class="grid-food ${color}"></div>`
            }else{
                gridDiv+=`<div class="grid-div ${color}"></div>`
            }
            dark = !dark;
        }
        dark = !dark;

    }
}

document.addEventListener('keydown',(e)=>{
        switch (e.key){
            case "ArrowDown":
                dir = {x : 0, y : 1}
            break;
            case "ArrowLeft":
                dir = {x : -1, y : 0}
            break;
            case "ArrowUp":
                dir = {x: 0, y : -1}
            break;
            case "ArrowRight":
                dir = {x: 1, y : 0}
            break;
        }
})
function snakefn(){
    music.play()
    let snaketailx;
    let snaketaily;
    if(snake.x.length>1){
        snaketailx = snake.x[snake.x.length - 1];
        snaketaily = snake.y[snake.y.length - 1];
        if(snake.x.length>2){
            for(let i = snake.x.length-2;i>=0;i--){
                snake.x[i+1] = snake.x[i];
                snake.y[i+1] = snake.y[i];
            }
        }else{
            for(let i = 0;i<snake.x.length-1;i++){
                snake.x[i+1] = snake.x[i];
                snake.y[i+1] = snake.y[i];
            }
        }
    }
    snake.x[0] = snake.x[0] + dir.x ;
    snake.y[0] = snake.y[0] + dir.y;
    if(snake.x[0] == food.x && snake.y[0] == food.y){
        food_audio.play();
        snake.x.push(snaketailx);
        snake.y.push(snaketaily);
        foodfn();
        scorefn();
    }
}
function foodfn(){
    let x, y;
    do {
        x = Math.floor(Math.random() * 17);
        y = Math.floor(Math.random() * 17);
    } while (snake.x.includes(x) && snake.y.includes(y) && compareNums(snake.x,snake.y,x,y));

    food = { x: x, y: y };
}

function compareNums(arr1, arr2, num1, num2) {
    const indexes1 = getAllIndexes(arr1, num1);
    const indexes2 = getAllIndexes(arr2, num2);
  
    for (const index1 of indexes1) {
      for (const index2 of indexes2) {
        if (index1 === index2) return true;
      }
    }
  
    return false;
}

function getAllIndexes(arr, num) {
    const indexes = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === num) {
        indexes.push(i);
      }
    }
    return indexes;
}

function gameoverfn(secondpart){
    if (compareNums(snake.x.slice(1),snake.y.slice(1),snake.x[0],snake.y[0]) || snake.x[0] == secondpart.x && snake.y[0] == secondpart.y || snake.x[0] < 0 || snake.y[0] < 0 || snake.x[0] > 17 || snake.y[0] > 17){
        document.getElementById("overscore").innerHTML = scorenum;
        document.getElementById("gmover").style.display = "flex";
        music.pause();
        gameover.play();
        return true;
    }
    return false
} 

function scorefn(){
    scorenum += 5;
    score.innerHTML = scorenum;
    if(HScore < scorenum){
        HScore = scorenum;
        highScore.innerHTML = HScore;
        localStorage.setItem("HighScore", HScore)
    }
}

function restart(){
    food = {x: 15, y: 5}
    snake = {x: [15,14], y: [15,14]}
    dir = {x: 0, y: -1}
    scorenum = 0;
    score.innerHTML = scorenum;
    document.getElementById("gmover").style.display = "none";
    window.requestAnimationFrame(contain);
}



let touchStartX, touchStartY;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const sensitivity = 85;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > sensitivity) {
        dir = { x: deltaX > 0 ? 1 : -1, y: 0 };
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > sensitivity) {
        dir = { x: 0, y: deltaY > 0 ? 1 : -1 };
    }
});

window.requestAnimationFrame(contain);
