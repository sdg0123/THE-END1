var dog,sadDog,happyDog;
var foodObj;
var feed, addFood;
var database;
var foodStock, foodS;
var lastFed, fedTime;



function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
  milkImg=loadImage("Images/Milk.png");
bg=loadImage("Images/virtual pet.jpg")
}

function setup() {
  createCanvas(1000,400);
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton(" Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton(" Add Food ");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(bg);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
            lastFed = data.val();
  });

  fill("yellow");
  textSize(15);
  if(lastFed >= 12){
    text(" LastFeed : " + lastFed%12 + " pm ", 350,30);
  }
  else if(lastFed == 0){
    text(" Last Feed : 12 am ", 350,30 );
  }
  else{
    text("Last Feed : " + lastFed + " am " , 350, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
      Food :foodS
  });
}




