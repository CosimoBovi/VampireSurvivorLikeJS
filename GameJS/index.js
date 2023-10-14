let game;
let gameAreaWidth=960;
let gameAreaHeight=640;
let punteggio=0;

let start;


morto=false;
let enemyList=[];
let lastEnemyTime=0; 
let enemySpawnTime=2000;


let player;
let attackSpeed = 1000;
let lastAttack = 0;
let listaProiettili=[];
let command = {}; 



function init(){
  
    onkeydown = onkeyup = function(e){
        command[e.key] = e.type == 'keydown';
    }
    game = document.getElementById("gameArea");
    createTerrain();
    createPlayer();
    window.requestAnimationFrame(frameHandle);
}

function createTerrain(){

    terreno = document.getElementById("terreno");

    for(i=0;i<30;i++){
        for(y=0;y<20;y++){

            imageNumber = Math.floor(Math.random() * 62)
            if(imageNumber<10) imageNumber = "0"+imageNumber;
            imgName = "./immagini/terreno/tile0" + imageNumber + ".png";

            imgTag = document.createElement("img");
            imgTag.src = imgName;
            imgTag.classList.add("terrenoTile");
            terreno.appendChild(imgTag);
        }
    }

}

function createPlayer(){

    player = document.createElement("img");
    player.classList.add("player");
    player.src="./immagini/PG/character.png";
    player.style.top="320px";
    player.style.left="480px";
    player.style.width="32px";
    player.style.height="32px";
    player.style.transform = "scaleX(1)";
    player.id="player";
    game.appendChild(player);

}

function frameHandle(timestamp){
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    pgMovementHandle(elapsed);
    createAttack(timestamp);
    moveAttack(elapsed);
    createEnemy(timestamp);
    enemyMoveAll(elapsed);
    collisionAll();
    if(!morto) window.requestAnimationFrame(frameHandle);
    else alert("hai perso");
    start=timestamp;
}

function pgMovementHandle(elapsed){

    count = 0.1*elapsed;
  
    if(command["w"]){
        spostamento =  parseFloat(player.style.top) - count;
        if (spostamento>0) player.style.top = spostamento +"px";

    }
    if(command["s"]){
        spostamento = parseFloat(player.style.top) +count;
        if (spostamento<640-32)
        player.style.top = spostamento+"px";

    }
    if(command["d"]){
        spostamento = parseFloat(player.style.left) +count;
        if (spostamento<960-32)
        player.style.left = spostamento+"px";
        player.style.transform = "scaleX(-1)";
      

    }
    if(command["a"]){
        spostamento = parseFloat(player.style.left) -count;
        if (spostamento>0)
        player.style.left = spostamento+"px";
        player.style.transform = "scaleX(1)";
    }

}

function createAttack(timestamp){
    if(timestamp-lastAttack >= attackSpeed){
        proiettile = document.createElement("img");
        proiettile.classList.add("proiettile");
        proiettile.src="./immagini/PG/attacco.png";
        proiettile.id="proiettile"+listaProiettili.length;
        proiettile.style.height="16px";
        proiettile.style.width="32px";
        posizioneProiettile(proiettile);
        game.appendChild(proiettile);
        listaProiettili.push(proiettile);
        lastAttack=timestamp;
    }

}

function moveAttack(elapsed){
    count = 0.2*elapsed;
    listaProiettili.forEach((proiettile) => {
        
        moveProiettile(proiettile,count);
    });
}

function moveProiettile(proiettile,count){

    if(proiettile.style.transform == "scaleX(1)"){
       
        spostamento = parseFloat(proiettile.style.left) +count;
        if (spostamento<960-32)
            proiettile.style.left = spostamento+"px";
        else{
            const index = listaProiettili.indexOf(proiettile);

            listaProiettili.splice(index, 1);
            proiettile.remove();
        }

    }else{
        spostamento = parseFloat(proiettile.style.left) -count;
        if (spostamento>0) 
            proiettile.style.left = spostamento+"px";
        
        else{
            const index = listaProiettili.indexOf(proiettile);

            listaProiettili.splice(index, 1);
            proiettile.remove();
        }
            
        
    }

}


function posizioneProiettile(proiettile){

    if(player.style.transform == "scaleX(1)"){
        
        posizione = parseFloat(player.style.left) -32;
        proiettile.style.left = posizione+"px";
        posizione = parseFloat(player.style.top) +8;
        proiettile.style.top = posizione+"px";
        proiettile.style.transform = "scaleX(-1)";
    }
    if(player.style.transform == "scaleX(-1)"){
       
        posizione = parseFloat(player.style.left) + 32;
        proiettile.style.left = posizione+"px";
        
        posizione = parseFloat(player.style.top) +8;
        proiettile.style.top = posizione+"px";
        
        proiettile.style.transform = "scaleX(1)";
    }
}



function createEnemy(timestamp){
    if (timestamp - lastEnemyTime >= enemySpawnTime) {
        
        enemy = document.createElement("img");
        enemy.classList.add("enemy");
        enemy.src="./immagini/Nemici/zombie.png";
        enemy.id="enemy"+enemyList.length;
        enemy.style.height="32px";
        enemy.style.width="32px";
        findPosition(enemy);
        game.appendChild(enemy);
        enemyList.push(enemy);

        punteggio++;
        document.getElementById("points").innerHTML=punteggio;
        lastEnemyTime = timestamp;
        enemySpawnTime-=20;
        //lastEnemyTime=9999999999999999999;
    }


}


function findPosition(enemy){

    const edge = Math.floor(Math.random() * 4); // Genera un numero casuale tra 0 e 3 per selezionare un bordo

    let top, left;

    switch (edge) {
        case 0: // Bordo superiore
        top = 0;
        left = Math.random() * (gameAreaWidth);
        break;
        case 1: // Bordo destro
        top = Math.random() * (gameAreaHeight);
        left = gameAreaWidth-32;
        break;
        case 2: // Bordo inferiore
        top = gameAreaHeight-32;
        left = Math.random() * (gameAreaWidth);
        break;
        case 3: // Bordo sinistro
        top = Math.random() * (gameAreaHeight);
        left = 0;
        break;
    }

    enemy.style.top=top+"px";
    enemy.style.left=left+"px";

}

function enemyMoveAll(elapsed){
    count = 0.05*elapsed;
    enemyList.forEach((enemy) => {
        
        moveEnemy(enemy,count);
    });

}

function moveEnemy(enemy,count){
    

    if(parseFloat(player.style.top)<parseFloat(enemy.style.top)){
        spostamento =  parseFloat(enemy.style.top) - count;
        enemy.style.top = spostamento +"px";
    }
    if(parseFloat(player.style.top)>parseFloat(enemy.style.top)){
        spostamento =  parseFloat(enemy.style.top) + count;
        enemy.style.top = spostamento +"px";
    }
    if(parseFloat(player.style.left)>parseFloat(enemy.style.left)){
        spostamento = parseFloat(enemy.style.left) +count;
        enemy.style.left = spostamento+"px";
        enemy.style.transform = "scaleX(1)";
    }
    if(parseFloat(player.style.left)<parseFloat(enemy.style.left)){
        spostamento = parseFloat(enemy.style.left)- count;
        enemy.style.left = spostamento+"px";
        enemy.style.transform = "scaleX(-1)";
    }

}

function collisionAll(){
    enemyList.forEach((enemy) => {
        if(checkCollisionCSS(player,enemy)){
            console.log("Morto");
            morto=true;
        }
        listaProiettili.forEach((proiettile) => {
            if(checkCollisionCSS(proiettile,enemy)){
                console.log("Colpito");
                punteggio+=10;
                document.getElementById("points").innerHTML=punteggio;
                removeVisualElement(listaProiettili,proiettile);
                removeVisualElement(enemyList,enemy);
            }
        })
    });
}

function removeVisualElement(vettore, elemento){
    game.removeChild(elemento);
    const index = vettore.indexOf(elemento);
    if (index > -1) { // only splice array when item is found
        vettore.splice(index, 1); // 2nd parameter means remove one item only
    }
}

function checkCollisionXY(obj1, obj2) {
    const obj1Right = obj1.x + obj1.l;
    const obj1Bottom = obj1.y + obj1.h;
    const obj2Right = obj2.x + obj2.l;
    const obj2Bottom = obj2.y + obj2.h;
  
    if (
      obj1.x < obj2Right &&
      obj1Right > obj2.x &&
      obj1.y < obj2Bottom &&
      obj1Bottom > obj2.y
    ) {
      return true; 
    }
  
    return false;
  }


  function checkCollisionCSS(obj1, obj2) {
    const obj1Top = parseFloat(obj1.style.top);
    const obj1Left = parseFloat(obj1.style.left);
    const obj1Width = parseFloat(obj1.style.width)/2;
    const obj1Height = parseFloat(obj1.style.height)/2;
    
    const obj2Top = parseFloat(obj2.style.top);
    const obj2Left = parseFloat(obj2.style.left);
    const obj2Width = parseFloat(obj2.style.width)/2;
    const obj2Height = parseFloat(obj2.style.height)/2;
  
    if (
      obj1Left < obj2Left + obj2Width &&
      obj1Left + obj1Width > obj2Left &&
      obj1Top < obj2Top + obj2Height &&
      obj1Top + obj1Height > obj2Top
    ) {
      return true; 
    }
  
    return false; 
  }