$(function () {
    const INIT_SIZE = 60;           // 玩家小球初始大小
    const INIT_SPEED = 0.05;       // 小球初始速度
    const INIT_COLOR = 5;           // 小球默认颜色下标
    const FOODS_NUM = 50;           // 食物默认数量
    const BOMB_NUM = 5;             // 炸弹默认数量
    const IS_SAME_SIZE = false;     // 食物/炸弹大小是否固定(false表示大小随机)
    const DEFAULT_FOOD_SIZE = 90;   // 食物默认大小(IS_SAME_SIZE为true时有效)
    const DEFAULT_BOMB_SIZE = 12;   // 炸弹默认大小(IS_SAME_SIZE为true时有效)
    const REFRESH_TIME = 1.6;       // 食物/炸弹刷新时间
    const INCREASE_SPEED = 0.05;    // 小球增长速度
    const FOODS_COLORS = [
        "#FE9D01",
        "#C5DA01",
        "#99CF15",
        "#008678",
        "#D40045",
        "#7ed321",
        "rgb(200,200,169)",
        "rgb(254,67,101)",
        "rgb(131,175,155)",
        "rgb(249,205,173)",
        "rgb(250,227,113)",
        "rgb(38,157,128)",
        "rgb(6,128,67)",
        "rgb(137,157,192)"
    ];
    
    const FOODS_IMG = [
        "assets/img/icecream1.png",
        "assets/img/icecream2.png",
        "assets/img/pepper1.png",
        "assets/img/pepper2.png"
    ];
    
     var isDie = false;
    
    
    class Ball {
        constructor(element, size, bg, name, temp, blood) {
            this.element = element;
            this.size = size;
            this.bg = FOODS_COLORS[bg];
            this.name = name;
            this.element.style.width = size + "px";
            this.element.style.height = size + "px";
            this.element.style.background = this.bg;
            this.element.style.lineHeight = size + "px";
            this.element.innerHTML = name;
            this.element.dataset.temp = temp;
            this.element.dataset.blood = blood;
            
            let self = this;
            let temp_content = 35;
            let $blood_line = $('.blood-line');
            $blood_line.css({backgroundSize:'100%'});
            $blood_line.html(self.element.dataset.blood);
            
            
            this.handleInterval1 = setInterval(function () {
                if(temp_content<50){
                    temp_content++;
                }
                
                let temp = self.element.dataset.temp;
                if (parseInt(self.element.dataset.blood) <= 0 || temp > 42) {
                    self.element.style.backgroundColor = '#bbb';
                    isDie = true;
                    $('.mask').css({'top':'0'});
                } else if (34 < temp && temp <= 37 && self.element.dataset.blood < 100) {
                    self.element.style.backgroundColor = '#7ed321';
                    self.element.dataset.blood = parseInt(self.element.dataset.blood) + 1;
                } else if (37 < temp && temp <= 39) {
                    self.element.style.backgroundColor = '#f96';
                    self.element.dataset.blood = parseInt(self.element.dataset.blood) - 5;
                } else if (39 < temp && temp <= 41) {
                    self.element.style.backgroundColor = '#cc0000';
                    self.element.dataset.blood = parseInt(self.element.dataset.blood) - 10;
                } else if (32 < temp && temp <= 34) {
                    self.element.style.backgroundColor = '#50e3c2';
                    self.element.dataset.blood = parseInt(self.element.dataset.blood) - 5;
                } else if (30 < temp && temp <= 32) {
                    self.element.style.backgroundColor = '#4a90e2';
                    self.element.dataset.blood = parseInt(self.element.dataset.blood) - 10;
                }
                
                
                $blood_line.css({backgroundSize:self.element.dataset.blood+'% 100%'});
                $blood_line.html(self.element.dataset.blood);
                $('#temp-content').html(temp_content+"<sup>℃</sup>");
                
                
            }, 2000);
            
            this.handleInterval2 = setInterval(function () {
                self.element.dataset.temp = parseInt(self.element.dataset.temp) + 2;
                self.element.innerHTML = self.element.dataset.temp + "℃";
            }, 5000);
            
            
        }
        
        move() {
            if (1) {
                $(this.element).velocity("stop");
                let left = event.pageX - (parseFloat(this.size) / 2);
                let top = event.pageY - (parseFloat(this.size) / 2);
                var times = this.size / INIT_SPEED;
                $(this.element).velocity({
                    left: left, top: top
                }, {
                    duration: times,
                    easing: "linear",
                    progress: function () {
                        for (let i = 0; i < foods.length; i++) {
                            if (Food.isEat(ball, foods[i])) {
                                ball.eat(foods[i]);
                                foods[i].disappear();
                                foods.splice(i, 1);
                            }
                        }
                    },
                });
                return true;
            } else return false;
        }
        
        eat(food) {
            let change_size = parseFloat(this.size) + food.size * INCREASE_SPEED;
            let value = parseInt(food.element.dataset.value);
            let self = this;
            this.size = change_size;
            
            
            if (value === 0 || value === 1) {
                this.element.dataset.temp = parseInt(this.element.dataset.temp) - 1;
                this.element.className = 'ball desc';
                document.getElementById('ice').play();
                
            } else {
                this.element.dataset.temp = parseInt(this.element.dataset.temp) + 1;
                this.element.className = 'ball plus';
                document.getElementById('pepper').play();
                
            }
            
            setTimeout(function () {
                self.element.className = 'ball';
            }, 1000);
            
            let temp = this.element.dataset.temp;
            
            
            if (34 < temp && temp <= 37) {
                this.element.style.backgroundColor = '#7ed321';
            } else if (37 < temp && temp <= 39) {
                this.element.style.backgroundColor = '#f96'
            } else if (39 < temp && temp <= 41) {
                this.element.style.backgroundColor = '#cc0000'
            } else if (32 < temp && temp <= 34) {
                this.element.style.backgroundColor = '#50e3c2'
            } else if (30 < temp && temp <= 32) {
                this.element.style.backgroundColor = '#4a90e2'
            } else {
                this.element.style.backgroundColor = '#bbb';
                isDie = true;
                $('.mask').css({'top':'0'});
            }
            
            
            this.element.innerHTML = this.element.dataset.temp + "℃";
            
        }
        
        
    }
    
    class Food {
        constructor(element, size, bg, posX, posY, rotate) {
            this.element = element;
            this.size = size;
            this.bg = FOODS_IMG[bg];
            this.posX = posX;
            this.posY = posY;
            this.element.style.width = size + "px";
            this.element.style.height = size + "px";
            this.element.style.backgroundImage = 'url(' + this.bg + ')';
            this.element.style.left = posX + "px";
            this.element.style.top = posY + "px";
            this.element.style.transform = 'rotate(' + rotate + 'deg)';
            this.element.dataset.value = bg;
            
            //console.log(this.bg);
            //console.log(size);
        }
        
        disappear() {
            this.element.remove();
        }
        
        static isEat(ball, food) {
            var ballSIZE = ball.size;
            var ballX = parseFloat(ball.element.style.left.split("px")[0]) + ballSIZE / 2;
            var ballY = parseFloat(ball.element.style.top.split("px")[0]) + ballSIZE / 2;
            var length = Math.sqrt(Math.pow((parseFloat(food.posX) + food.size / 2 - ballX), 2) + Math.pow((parseFloat(food.posY) + food.size / 2 - ballY), 2));
            if (length < (parseFloat(ballSIZE) + food.size) / 2) {
                return true;
            }
            else return false;
        }
    }
    
    
    var color_index = INIT_COLOR;
    var ball_div = document.createElement("div");
    ball_div.setAttribute("class", "ball");
    document.body.appendChild(ball_div);
    ball_div = document.body.lastChild;
    var ball = new Ball(ball_div, INIT_SIZE, color_index, name, 35, 100);
    var foods = [];
    
    function makeFood(num) {
        for (let i = 0; i < num; i++) {
            var food_div = document.createElement("div");
            food_div.setAttribute("class", "food");
            document.body.insertBefore(food_div, document.body.firstChild);
            let size = 35;
            let rotate = Math.random() * 360;
            let bg = parseInt(Math.random() * (FOODS_IMG.length));
            let pos_x = Math.random() * document.documentElement.clientWidth;
            let pos_y = Math.random() * document.documentElement.clientHeight;
            var food = new Food(food_div, size, bg, pos_x, pos_y, rotate);
            foods.push(food);
        }
    }
    
    makeFood(FOODS_NUM);
    setInterval(function () {
        if (foods.length < FOODS_NUM) {
            let num = FOODS_NUM - foods.length;
            makeFood(num);
        }
    }, REFRESH_TIME * 100);
    $(document).on("mousemove", function () {
        
        if (isDie == false) {
            ball.move();
            console.log('fadsfasd')
        } else {
            clearInterval(ball.handleInterval1);
            clearInterval(ball.handleInterval2);
            $(document).unbind();
            document.querySelector('#fail').play();
            
        }
    });
});