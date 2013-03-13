// get height and width of window
var w = window.innerWidth;
var h = window.innerHeight;

var width = w, height = h,
    start = Date.now(),
// what speed will the animation run at 0.25 is standard    
    speed = 0.25;

// set up svg
  var svg = d3.select(".ocean")
  .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");

// create a bubble

function Bubble(m, x, y) {
  
  this.location = new Vector(x,y);
  this.velocity = new Vector(0,0);
  this.acceleration = new Vector(0,0);
  this.mass = m;
  this.radius = m * 10;

// set attributes of circle in d3, bubble is just a circle
  this.circle = svg.append("circle")
    .attr("cx", this.location.x)
    .attr("cy", this.location.y)
    .attr("r", this.radius)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .style('fill-opacity', 0.25)

// give the circle a force...force/mass
  this.applyForce = function (force) {
    var f = force.divide(this.mass);
    this.acceleration = this.acceleration.add(f);
  }

// this is a special force to simulate the "drag" of the ocean. It pushes down on the bubble.
  this.oceanForce = function() {
    var oceanDrag = 0.1 * this.velocity.dot(this.velocity);
    var drag = this.velocity.multiply(-1);
    drag = drag.unit();
    drag = drag.multiply(oceanDrag);
    this.applyForce(drag);
  }

// updates the bubble and then draws it
  this.run = function() {
    this.velocity = this.velocity.add(this.acceleration);
    this.location = this.location.add(this.velocity);
    this.acceleration = this.acceleration.multiply(0.0);  
    this.circle.attr("cx", this.location.x)
      .attr("cy", this.location.y);
  }
};


var numberOfBubbles = 40;
var bubbles = [];
// loop through and give some initial bubbles in the bubble array. 3 values are mass, x location, y location. Needs to start just below the screen with some randomness.
for (var i = 0; i < numberOfBubbles; i++) {
  bubbles.push(new Bubble(Math.random()*5+0.5, i*width/numberOfBubbles, (Math.floor(Math.random() * (height+300 - (height-20) + 1)) + (height-20))));
}

// run the animiation, this is like Processing's "draw()" 
d3.timer(function() {
  // for each bubble in the array, apply forces and then draw it
  bubbles.forEach(function(b) {
    // gravityX just means it needs to oscillate left and right some
    var gravityX = Math.random()*0.4 -0.2;
    // gravityY sets to "anti-gravity" because it is a bubble
    var gravityY = -0.1*b.mass;
    var gravity = new Vector(gravityX,gravityY);
    b.applyForce(gravity);
    b.oceanForce();
    b.run();
    // as the bubbles are going off the screen, add another one! Needs to start just below the screen with some randomness.
    if (b.location.y <= 401.5 && b.location.y >= 400){
      bubbles.push(new Bubble(Math.random()*5+0.5, (Math.floor(Math.random() * (width + 1))), (Math.floor(Math.random() * (height+300 - (height+20) + 1)) + (height+20))));
    }
  });

}); 

