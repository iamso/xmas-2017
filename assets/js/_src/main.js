const defaults = {
  chars: 'abcdefghijklmnopqrstuvwxyz0123456789',
  speed: 75,
};

class Letter {
  constructor(element, options = {}) {
    this.el = element;
    this.original = element.textContent;
    this.options = Object.assign({}, defaults, options);
  }
  start() {
    this.stop();
    this.random();
    this.el.classList.add('scrambling');
    this.interval = setInterval(() => {
      if (typeof this.next === 'function') {
        this.next();
      }
      else {
        this.random();
      }
    }, this.options.speed);
    return this;
  }
  stop() {
    clearInterval(this.interval);
    delete this.interval;
    this.el.classList.remove('scrambling');
    return this;
  }
  reveal(duration = 0) {
    return new Promise(resolve => {
      this.interval || this.start();
      setTimeout(() => {
        if (duration) {
          this.next = () => {
            this.stop();
            this.value = this.original;
            delete this.next;
            resolve();
          };
        }
        else {
          this.stop();
          this.value = this.original;
          resolve();
        }
      }, duration);
    });
  }
  scramble(duration = 0) {
    return new Promise(resolve => {
      this.interval || this.start();
      setTimeout(() => {
        this.stop();
        resolve();
      }, duration);
    });
  }
  random() {
    let value = '';
    for (let i = 0; i < this.original.length; i++) {
      value += this.options.chars.charAt(Math.floor(Math.random() * this.options.chars.length));
    }
    return this.value = value;
  }
  get value() {
    return this.el.textContent;
  }
  set value(value) {
    this.el.textContent = value;
  }
}

const letterGrid = document.querySelector('.letter-grid');
const letters = [].slice.call(document.querySelectorAll('.letter'), 0);
const startButton = document.querySelector('.start-button');
let p = Promise.resolve();

const letterElements = [];

for (let i in letters) {
  const l = new Letter(letters[i]);
  l.scramble();
  letterElements.push(l);
}

startButton.addEventListener('click', start);

sleep(500).then(() => {
  document.documentElement.classList.add('loaded');
});

function start() {
  startButton.classList.add('hide');
  letterGrid.classList.remove('hide');
  for (let i in letterElements) {
    const l = letterElements[i];
    p = p.then(() => l.reveal(random(200, 400)));
    p = p.then(() => {
      l.el.classList.add('done');
      return Promise.resolve();
    });
    if (i >= letterElements.length - 1) {
      p = p.then(() => sleep(1000));
      p = p.then(() => {
        document.documentElement.classList.add('done');
      });
    }
  }
}

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

function random(min = 0, max = 1) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

const c = console;
c && c.log(
  `
      *
     .#.
    .###.
   .#%##%.
  .%##%###.
 .##%###%##.
.merry  xmas.
     and
    happy
    2018!
  `
);
