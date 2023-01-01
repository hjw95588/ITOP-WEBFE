<template>
  <div id="screen">

    <!--    <button @click="isShow = !isShow">显示/隐藏</button>
        <transition-group appear
                          name="animate__animated animate__bounce"
                          enter-active-class="animate__swing"
                          leave-active-class="animate__backOutUp" >
          <h1 v-show="isShow" key="1">你好啊！</h1>
          <h1 v-show="isShow" key="2">尚硅谷！</h1>
        </transition-group>-->

    <button class="btn-love"  @click="sendLove($event)" >
      <svg class="love-icon"  :viewBox="viewBox">
        <path :d="heartIcon"/>
      </svg>
      <transition-group name="love-move" tag="div" ref="loveUser">
        <div class="send-love"
             ref="love-item"
             :class="love.move"
             :key="'loveItem' + i"
             @animationend="fadeLove(i)"
             v-if="love.show === true"
             v-for="(love,i) in loves"
        >
          <svg class="love-icon" :viewBox="viewBox"
               :class="{'icon-red':love.color === 'red',
               'icon-orange':love.color === 'orange',
               'icon-yellow':love.color === 'yellow',
               'icon-green':love.color === 'green',
               'icon-blue':love.color === 'blue',

               'icon-purple':love.color === 'purple',
               'icon-fuchsia':love.color === 'fuchsia',
               'icon-olive':love.color === 'olive',
               'icon-teal':love.color === 'teal',
               'icon-aqua':love.color === 'aqua',
               'icon-lime':love.color === 'lime',

               'icon-violet':love.color === 'violet'}"
          >
            <path :d="heartIcon"/>
          </svg>
        </div>
      </transition-group>
      <b v-if="count!=0" class="divright">{{count}}</b>
    </button>
  </div>
</template>

<script>
import 'animate.css'
import { nowGiveLike} from "@/api/person/givelike";
const LOVE_COLOR = [
  'red',//红
  'orange',//橙
  'yellow',//黄
  'green',//绿
  'blue',//蓝
  'violet',//蓝紫色
  'purple',//紫
  'fuchsia',//紫红
  'olive',//橄榄
  'teal',//青色
  'aqua',//浅绿
  'lime',//亮绿

];

// Generates random number.
function random(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

// Creates 'love' element and put it at the same
// position of the 'heart' inside the button.
function createLove(vue) {
  let color = random(0, LOVE_COLOR.length - 1);
  let move = random(0, 95);
  vue.loves.push({
    color: LOVE_COLOR[color],
    move: "send-love-move-" + move,
    show: true
  });
}

export default {
  props:{
    userInfo:{
      type: Object,
    }
  },
  mounted() {
    console.log('mounted',new Date().getTime())
    this.$bus.$on('transmit',(data,flag)=>{
      console.log("flag",flag,"data ",data,"时间戳："+new Date().getTime())
      if(flag=='0'){
        this.sessionId=''
      }else{
        this.sessionId=data
      }
      this.loves=[];
      this.count=0;
    })
  },
  beforeDestroy() {
    //this.$bus.$off('transmit')
  },
  created() {

  },
  watch:{
    'userInfo.birUserId'(){
      this.loves=[];
      this.count=0;
      /*if(this.$refs.loveUser.children.length > 0) {
        this.loves=[];
        this.count=0;
      }*/
    }
  },
  data() {
    return {
      sessionId:'',//用于点赞的sessionId
      count:0,//计数
      viewBox:"0 0 24 24",
      isShow:true,
      loves: [],
      heartIcon:"M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2," +
        "5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76," +
        "3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
    };
  },
  methods: {
    clickGiveLike(){
      //点赞
      if(this.sessionId){
        let queryParams={
          userName:this.userInfo.birName,
          userId:this.userInfo.birUserId,
          sessionId:this.sessionId
        }
        nowGiveLike(queryParams).then(response => {
          if(response.code==200){
            if(response.data<=19){
              this.count=response.data+1
            }else{
              this.count=20
            }
          }
        });
      }
      else{
        //不存在，则count自己玩
        this.count++;
      }

    },
    sendLove(evt) {
      let elm = evt.target.children[0];
      let rect = elm.getBoundingClientRect();
      let em = parseFloat(getComputedStyle(elm).fontSize);
      createLove(this);

      this.clickGiveLike();

      //if(this.count>=20) this.count=1;
    },
    fadeLove(index) {
      if (this.loves[index] !== null) {
        this.loves[index].show = false;
      }
    }
  }
};
</script>

<style lang="scss">

$btn-love-background-color: #e6093a;

$btn-love-float-size: 0.5em;
$btn-love-border: solid 0.35em darken($btn-love-background-color, 10%);
$btn-love-box-shadow: 0 $btn-love-float-size darken($btn-love-background-color, 10%);
$btn-love-transition-time: 175ms;
$btn-love-transition: box-shadow $btn-love-transition-time ease-out,
transform $btn-love-transition-time ease-out;

$send-love-time: 2000ms;

#screen {
  font-size: 9px;
  /*background-color: #ffa3e2;
  width: 150px;
  height: 150px;*/
  height:32px;
  margin:auto;

  display: grid;
  place-items: center;
  overflow: hidden;

}

.btn-love {
  //background-color: $btn-love-background-color;

  cursor:pointer;
  //pointer-events: auto;

  background:none;
  border: 0;//$btn-love-border
  outline: 0;
  box-sizing: border-box;
  //border-radius: 50%;
  //box-shadow: $btn-love-box-shadow;
  transition: $btn-love-transition;
  position: absolute;//relative          气泡在范围内（去掉screen的设置 height margin）       absolute           气泡越出去[screen的设置 height margin:auto]
  &:active {
    box-shadow: 0 0 darken($btn-love-background-color, 10%);
    transform: translateY($btn-love-float-size);
  }
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
  }
  svg {
    fill: #2A435B;
  }
}

.send-love {
  position: absolute;
  top: 50%;//50% 因为计数暂居了位置
  left: 50%;
  transform: translate(-50%, -50%);
  &.love-move-leave-active {
    display: none;
  }
  svg.icon-red {
    fill: #ff1f57;
  }
  svg.icon-orange {
    fill: #ff9645;
  }
  svg.icon-yellow {
    fill: #ffea73;
  }
  svg.icon-green {
    fill: #7fff7a;
  }
  svg.icon-blue {
    fill: #61a8ff;
  }
  svg.icon-violet {
    fill: #cf82ff;
  }

  svg.icon-purple {
    fill: #800080;
  }

  svg.icon-fuchsia {
    fill: #FF00FF;
  }
  svg.icon-olive {
    fill: #808000;
  }
  svg.icon-teal {
    fill: #008080;
  }
  svg.icon-aqua {
    fill: #00FFFF;
  }
  svg.icon-lime {
    fill: #00FF00;
  }
}
.love-icon {
  width: 4em;
  height: 4em;
  vertical-align: top;
}

.divright {
  position: absolute;
  color: white;
  font-size: 12px;
  background-color: red;
  width: 20px;
  height: 20px;
  line-height: 20px;
  left: 80%;
  top: -1px;
  text-align: center;
  -webkit-border-radius: 24px;
  border-radius: 24px;
}


$index: 0;

@for $x from 8 through 19 {
  @for $y from 10 through 17 {
    @keyframes send-love-x-#{$index} {
      0% {
        left: calc(50% - 0em);
      }
      100% {
        left: calc(50% - #{$x - 14}em);
      }
    }

    @keyframes send-love-y-#{$index} {
      0% {
        top: calc(50% - 0em);
      }
      50%, 60% {
        top: calc(50% - #{$y}em);
      }
      100% {
        top: calc(50% - #{$y * 0.8}em);
      }
    }

    .send-love.love-move-enter-active.send-love-move-#{$index} {
      animation: send-love-x-#{$index} $send-love-time ease-out forwards
      , send-love-y-#{$index} $send-love-time ease-out forwards
      , send-love-hide $send-love-time ease-out forwards;
    }

    $index: $index + 1;
  }
}

@keyframes send-love-hide {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}

.come{
  animation:demo 1s;
}

.go{
  animation:demo 1s reverse;
}


@keyframes demo {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}
</style>
