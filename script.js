var hod; //переменная для отслеживания хода
var arr = [];//двумерный массив с значениями в квадратах X/O/0
var audio = new Audio();

audio.src = 'audio.mp3'; 
audio.volume = 0.3;

function startAudio(audio){
  audio.play();
}

function playAudio(audio) {
            // Check for audio element support
            if (window.HTMLAudioElement) {
                try {
                    var btn = document.getElementById("myBtn2");
                    if (audio.paused) {
                        audio.play();
                        btn.textContent = "Pause audio";
                    }
                    else {
                        audio.pause();
                        btn.textContent = "Play audio";
                    }
                }
                catch (e) {
                    
                     if(window.console && console.error("Error:" + e));
                }
            }
    }

function prepare() {
  "use strict"

  var canvas = document.getElementById("myCanvas");
  var input = document.getElementById("myInp");
  var myLabel = document.getElementById("myLabel");
  myLabel.textContent = "";

  canvas.onclick = draw;

  
  hod = 1;

  if ( (input.value < 5) || (input.value > 20) ) {alert("value must be more than 4 and less than 21"); return;}

  canvas.width  = input.value*50; 
  canvas.height = input.value*50;	

  var ctx = canvas.getContext("2d");	

  for (var i = 0; i <= input.value*50; i += 50){ //отображения поля для игры
    
    for (var j = 0; j <= input.value*50; j+=50){
      ctx.strokeRect (i, j, 50, 50);
    }

  }

  var mas = [];			//заполнение двумерного массива нулями
  
  for (var i = 0; i < input.value; i++){
    mas[i] = 0;
  }

  for (var i = 0; i < input.value; i++){
    arr[i] = mas.slice();
  }

}

function draw(){
  "use strict"

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var myLabel = document.getElementById("myLabel");
  var x = 0; //Переменные для определения в какой из квадратов нажал пользователь
  var y = 0;	
  
  var canvasAngleX = canvas.getBoundingClientRect().left; //отсчет от левого верхнего угла
  var canvasAngleY  = canvas.getBoundingClientRect().top;
  
  
  x = Math.trunc((window.event.clientX-canvasAngleX)/50);
  y = Math.trunc((window.event.clientY-canvasAngleY)/50);
 

  if (x > canvas.width/50-1) x = canvas.width/50-1; //при нажатии на внешние границы canvas, передается значение квадрата которому соответствует эта граница 
  if (y > canvas.height/50-1) y = canvas.height/50-1;


  if (arr[x][y] == 0){	//отрисовка Х или 0 в зависимости от хода и заполнения массива arr
    
    if (hod%2){ 				
      
      ctx.beginPath();
      ctx.strokeStyle = "#B624C6";

      ctx.moveTo(x*50, y*50+50);
      ctx.lineTo(x*50+50, y*50);

      ctx.moveTo(x*50+50, y*50+50);
      ctx.lineTo(x*50, y*50);
      
      ctx.stroke(); 

      arr[x][y] = "X";
      myLabel.textContent = "Turn O";

    } else  {
      ctx.beginPath(); 
      ctx.strokeStyle = "#0526FF";

      ctx.arc(x*50+25, y*50+25, 25, 0, Math.PI*2);
      ctx.stroke();

      arr[x][y] = "O";
      myLabel.textContent = "Turn X";
    }
    
    hod++;
  }
	
  var value = arr[x][y];

  var winSquartsOnX = [];
  var winSquartsOnY = [];

  function testWin(horizontalNavigRight, verticalNavigTop, horizontalNavigLeft, verticalNavigBottom){ //проверка победил ли какой-нибудь игрок

    var count = 0;
    var i = 1;
    var j = 1;
    winSquartsOnX = [x];
    winSquartsOnY = [y];

    while (count != 4 ){	

      if ( (arr[x+i*horizontalNavigRight] !=  undefined) && (value == arr[x+i*horizontalNavigRight][y+i*verticalNavigTop]) ) { //сравнение элементов по линиям, по которым мог выиграть игрок(линии выбираются в зависимости от прееданных параметров)
        count++; winSquartsOnX.push(x+i*horizontalNavigRight); winSquartsOnY.push(y+i*verticalNavigTop);  i++;  continue;
      } else {
        if ( (arr[x-j*horizontalNavigLeft] !=  undefined) && (value == arr[x-j*horizontalNavigLeft][y-j*verticalNavigBottom]) ) {	
          count++; winSquartsOnX.push(x-j*horizontalNavigLeft); winSquartsOnY.push(y-j*verticalNavigBottom); j++;  continue;}
      }

      return count;		
    }

    return count;
  }

  function drawWin() {
  	for (var i = 0; i < 5; i++){

    ctx.fillStyle = "rgba(0, 255, 68, 0.4)";
	ctx.fillRect (winSquartsOnX[i]*50, winSquartsOnY[i]*50 , 50, 50);
    
   	}
  }

  if (testWin(1, 0, 1, 0) == 4) {  //определение победил ли игрок, собрав 5 в ряд по горизонтали 
  	alert(value + " win ");
    drawWin();
  	canvas.onclick = function(event) { event.stopPropagation() } ; 
  	return 
  } 

  if (testWin(0, 1, 0, 1) == 4) { //определение победил ли игрок, собрав 5 в ряд по вертикали
  	alert(value + " win ");
  	drawWin();
  	canvas.onclick = function(event) { event.stopPropagation() };
  	return 
  	}  

  if (testWin(1, 1, 1, 1) == 4) { //определение победил ли игрок, собрав 5 в ряд по диагонали 1 
   alert(value + " win "); 
   drawWin();
   canvas.onclick = function(event) { event.stopPropagation() }; 
   return 
  } 

  if (testWin(-1, 1, -1, 1) == 4) {//определение победил ли игрок, собрав 5 в ряд по диагонали 2
  alert(value + " win ");
  drawWin();
  canvas.onclick = function(event) { event.stopPropagation() };
  return 
  }  
  
  var flag = false;
  
  for (var i = 0; i < arr.length; i++){  //проверка на ничью

    for(var j = 0; j < arr[i].length; j++){
      
      if ( arr[i][j] == 0 ) { flag = true;}    

    }
  }
  
  if (!flag) { 
   alert("draw");
   canvas.onclick = function(event) { event.stopPropagation() };
  }


}

