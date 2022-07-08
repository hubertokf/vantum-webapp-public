<template>
  <div class="timer">
    <div v-show ="statusType !== 'expired'">
      <div class="day">
        <span class="countnumber">{{ days }}</span>
        <div class="markerpoint">:</div>
        <div class="format">{{ wordString.day }}</div>
      </div>
      <div class="hour">
        <span class="countnumber">{{ hours }}</span>
        <div class="markerpoint">:</div>
        <div class="format">{{ wordString.hours }}</div>
      </div>
      <div class="min">
        <span class="countnumber">{{ minutes }}</span>
        <div class="markerpoint">:</div>
        <div class="format">{{ wordString.minutes }}</div>
      </div>
      <div class="sec">
        <span class="countnumber">{{ seconds }}</span>
        <div class="format">{{ wordString.seconds }}</div>
      </div>
    </div>
    <!-- <div class="message">{{ message }}</div>
    <div class="status-tag" :class="statusType">{{ statusText }}</div> -->
  </div>
</template>

<script>
export default {
  name: 'timer',
  props: ['starttime', 'endtime', 'trans'],
  data: function () {
    return {
      timer: '',
      wordString: {},
      start: '',
      end: '',
      interval: '',
      days: '',
      minutes: '',
      hours: '',
      seconds: '',
      message: '',
      statusType: '',
      statusText: ''
    }
  },
  created: function () {
    this.wordString = JSON.parse(this.trans)
  },
  mounted () {
    this.start = new Date(this.starttime).getTime()
    this.end = new Date(this.endtime).getTime()
    // Update the count down every 1 second
    this.timerCount(this.start, this.end)
    this.interval = setInterval(() => {
      this.timerCount(this.start, this.end)
    }, 1000)
  },
  methods: {
    timerCount: function (start, end) {
      // Get todays date and time
      var now = new Date().getTime()

      // Find the distance between now an the count down date
      var distance = start - now
      var passTime = end - now

      if (distance < 0 && passTime < 0) {
        this.message = this.wordString.expired
        this.statusType = 'expired'
        this.statusText = this.wordString.status.expired
        clearInterval(this.interval)
        return 0
      } else if (distance < 0 && passTime > 0) {
        this.calcTime(passTime)
        this.message = this.wordString.running
        this.statusType = 'running'
        this.statusText = this.wordString.status.running
      } else if (distance > 0 && passTime > 0) {
        this.calcTime(distance)
        this.message = this.wordString.upcoming
        this.statusType = 'upcoming'
        this.statusText = this.wordString.status.upcoming
      }
    },
    pad: function (n) {
      return (n < 10) ? ('0' + n) : n
    },
    calcTime: function (dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = this.pad(Math.floor(dist / (1000 * 60 * 60 * 24)))
      this.hours = this.pad(Math.floor(
        (dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      )
      this.minutes = this.pad(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)))
      this.seconds = this.pad(Math.floor((dist % (1000 * 60)) / 1000))
    }
  }
}
</script>

<style lang="scss" scoped>
.timer {
  font-size: 40px;
  color: #fff;
  text-align: center;

  .day, .hour, .min, .sec, .markerpoint{
    font-size: 30px;
    display: inline-block;
    font-weight: 500;
    text-align: center;
    // margin: 0 5px;
    line-height: 30px;

    .format {
      font-weight: 300;
      font-size: 12px;
      //@include margin-start(5);
      //display: inline-block;
      opacity: 0.8;
      width: 60px;
    }
  }
  .markerpoint{
    margin-left: 7px;
    margin-right: 3px;
  }
  .markerpoint, .countnumber {
    font-size: 44px;
  }
  .countnumber {
    // background: rgba(51, 51, 51, 0.53);
    padding: 0;
    font-weight: bold;
    display: inline-block;
    // width: 60px;
    text-align: center;
    margin: 0;
  }
  .message {
    font-size: 14px;
    font-weight: 400;
    margin-top: 5px;
  }
  .status-tag {
    width: 270px;
    margin: 10px auto;
    padding: 8px 0;
    font-weight: 500;
    color: #000;
    text-align: center;
    border-radius: 15px;
    &.upcoming {
      // background-color: lightGreen;
    }
    &.running {
      // background-color: gold;
    }
    &.expired {
      // background-color: silver;
    }
  }
}
</style>
