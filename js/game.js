// Minimum number of moves that makes 3 stars
const THREE_STAR=14;
// Minimum number of moves that makes 2 stars
const TWO_STAR=20;
// Total number of cards
const TOTAL_CARDS=16;
// Number of superhero images needed in game
const TOTAL_IMAGE=TOTAL_CARDS/2;

// List of cards opened
var openedCard=[];
// Number of moves made by player
var moves=0;
// Timer to keep track of time
var timer;
// Time when game start
var startTime;
// Time when timer is paused
var previousTime=0;
// Best record for time
var bestTime;
// Record for least number of moves
var bestMoves;
// Card image sequence from previous game
var oldSuperhero=[];
// List that holds all of your cards
var superhero = [
  "batman","baymax","captain-america","catwoman", "colossus","cyclops",
  "deadpool","flash","groot","harley-quinn","hellboy","hulk","ironman","joker",
  "leonardo","raphael","robocop","spiderman","storm","superman","thor",
  "wolverine","wolverine2","wonderwoman"
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description Shuffle the card and insert image to each card
*/
function prepareCard(){
  var superheroList = shuffle(superhero.slice());
  superheroList=shuffle(superheroList.slice(0,TOTAL_IMAGE).concat(superheroList.slice(0,TOTAL_IMAGE)));
  var i=0;
  $(".back").each(function() {
    if (oldSuperhero.length!==0){
      $(this).removeClass(oldSuperhero[i]);
    }
    $(this).addClass(superheroList[i]);
    i++;
  })
  oldSuperhero = superheroList.slice();
}

/**
* @description Convert the time to minutes and second format
* @return difference - current time calculated from starting of timer
* @return minutes - time in minutes
* @return seconds - time in seconds
*/
function countTime(){
  var now = new Date().getTime();
  var difference = now - startTime + previousTime;
  var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((difference % (1000 * 60)) / 1000);
  return [difference, minutes, seconds];
}

/**
* @description Start timer
*/
function startTimer(){
  startTime = new Date().getTime();
  timer = setInterval(function() {
    var time = countTime();
    $(".timer").text(time[1] + ":" + ("0" + time[2]).slice(-2));
  }, 1000);
}

/**
* @description Stop timer
* @return time - total played time
*/
function stopTimer(){
  var time = countTime();
  previousTime=time[0];
  clearInterval(timer);
  $(".time").text(time[1] + ":" + ("0" + time[2]).slice(-2));
  return time;
}

/**
* @description Reset the timer to 0:00.
*/
function resetTimer(){
  previousTime=0;
  clearInterval(timer);
  $(".timer").text("0:00");
}

/**
* @description Reset number of stars to three
*/
function resetStar(){
  $(".stars li:nth-child(3)").children().attr("src","images/star.png");
  $(".stars li:nth-child(2)").children().attr("src","images/star.png");
}

/**
* @description Reset the game.
*/
function resetGame(){
  var match = $(".match, .front-open, .back-open");
  $(match).removeClass("front-open back-open match");
  openedCard=[];
  resetStar();
  resetTimer();
  moves=0;
  $(".moves").text(moves);
}

/**
* @description Restart the game.
*/
function restartGame(){
  resetGame();
  setTimeout(function(){
    prepareCard();
    startTimer();
  },300);
}

 /**
 * @description Flip open the card and display card image if the card is not opened before
 * @param target - clicked card content
 * @return {boolean} - return true if card is not opened before and vice versa
 */
function openCard(target){
  if(!($(target).hasClass("match")) && !($(target).hasClass("show"))) {
    $(target).addClass("front-open show");
    $(target).siblings().addClass("back-open show");
    return true;
 }
 return false;
}

/**
* @description Add the card to a list of openedCard
* @param target - clicked card content
*/
function addCard(target){
  openedCard.push($(target).siblings().attr("class").split(" ")[2]);
}

/**
* @description Lock the cards in the open position
* @param el - card content element with class "show"
* @param target - clicked card content
*/
function lockOpen(el, target){
  $(el).addClass("match");
  openedCard.push($(target).siblings().attr("class").split(" ")[2]);
}

/**
* @description Hide the card's image and remove the cards from the openedCard list
* @param el - card content element with class "show"
* @param target - clicked card content
*/
function hideCard(el){
  $(el).addClass("wrong");
  $(el).effect( "shake", {distance:15, times:2},700);
  setTimeout(function(){
    $(el).removeClass("wrong front-open back-open");
  },700);
  openedCard.pop();
}

/**
* @description Check if the cards are matched
* @param target - clicked card content
*/
function checkMatch(target){
  var card = $(target).siblings().attr("class").split(" ")[2];
  var el=$(".show");
  if (card === openedCard[openedCard.length-1]){
    lockOpen(el, target);
  } else{
    hideCard(el);
  }
  $(el).removeClass("show");
}

/**
* @description Increase the move counter and display on the page
*/
function keepCount(){
  moves++;
  $(".moves").text(moves);
}

/**
* @description Decrease number of stars based on number of moves made by player
*/
function starLevel(){
  if (moves>THREE_STAR){
    $(".stars li:nth-child(3)").children().attr("src","images/lost_star.png");
  }
  if(moves>TWO_STAR){
    $(".stars li:nth-child(2)").children().attr("src","images/lost_star.png");
  }
}

/**
* @description Record least number of moves and time
* @param time - played time
*/
function recordBestScore(time){
  if (moves<=bestMoves || bestMoves===undefined){
    if (moves===bestMoves){
      compareBestTime(time);
    } else {
      bestMoves=moves;
      bestTime=time;
    }
    $(".best-time").text(bestTime[1] + ":" + ("0" + bestTime[2]).slice(-2));
    $(".best-move").text(bestMoves);
  }
}

/**
* @description Compare current time with best played time
* @param time - played time
*/
function compareBestTime(time){
  if (time<bestTime || bestTime===undefined){
    bestTime=time;
  }
}

/**
* @description Display a message with the final score and stop timer when all cards are matched
*/
function endGame(){
  if(openedCard.length===TOTAL_CARDS){
    setTimeout(function(){
      recordBestScore(stopTimer());
      $("#completeModal").modal('show');
    },700);
  }
}

// Start game
/**
* @description Open start modal on load
*/
$(window).on('load', function() {
    $('#startModal').modal('show');
});

/**
* @description Close start modal if player clicks on start button
*/
$("#start").on("click", function(){
  $( "#startModal" ).modal('hide');
  restartGame();
});

/**
* @description Restart the game if player clicks on restart icon
*/
$(".restart").on("click", function(){
  restartGame();
});

/**
* @description Pause the game and timer and show pause modal
*/
$(".pause").on("click",function(){
  stopTimer();
  $('#pauseModal').modal('show');
});

/**
* @description Continue the game if player clicks continue button on pause modal
*/
$("#continue").on("click", function(){
  $( "#pauseModal" ).modal('hide');
  startTimer();
});

/**
* @description Start a new game if player clicks new game button on pause modal
*/
$("#new-game").on("click", function(){
  $( "#pauseModal" ).modal('hide');
  restartGame();
});

/**
* @description Flip open card and check if two cards matched when card is clicked
*/
$(".content").on("click", function(evt){
  var click=evt.target;
  if($(click).siblings().attr("class")!==undefined){
    if(openCard(click)){
      if (openedCard.length%2!==0){
        keepCount();
        starLevel();
        checkMatch(click);
      }else{
        addCard(click);
      }
      endGame();
    }
  }
});

/**
* @description Restart the game when player clicks on replay button on complete modal
*/
$("#replay").on("click", function(){
  $( "#completeModal" ).modal('hide');
  restartGame();
});
