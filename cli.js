const readline = require('readline');
const Snake    = require('./snake')
const base     = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// Estado é mutável
let State = Snake.initialState()

// Operações da matriz de jogo
const Matrix = {
  ///Desenhando o mapa
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  ///Desenhando a cobra
  addSnake:  state => pipe(...map(Matrix.set('X'))(state.snake)),

  ///Dsenhando uma maçã
  addApple:  state => Matrix.set('o')(state.apple),
  
  ///Quando ocorre uma colisão, ele deixa o mapa todo em #
  addCrash:  state => state.snake.length == 0 ? map(map(k('#'))) : id,

  ///Juntando todos os caracteres criados e montando no mapa
  toString:  xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'),

  ///Adicionando as funções criadas
  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
  )(state)
}

// Eventos do teclado
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  //verificacoes para sair do jogo
  if (key.ctrl && key.name === 'c') process.exit()

  //verificação para as próximas movimentações da cobra, atribuindo as teclas de acordo com o sentido que a cobra deve ir
  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP':    State = Snake.enqueue(State, Snake.NORTH); break
    case 'A': case 'H': case 'LEFT':  State = Snake.enqueue(State, Snake.WEST);  break
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, Snake.SOUTH); break
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST);  break
  }
});

/**
 * LAÇO PRINCIPAL DO JOGO
 */
///Exibindo uma
/// exibindo o mapa no terminal 
const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State)))
/// Atribuindo os próximos passos para a cobra
const step = () => State = Snake.next(State)

///Opções para uma velocidade da cobra
const vel = (v=3) => {
    switch (v) {
        case 1: return 250; break;
        case 2: return 200; break;
        case 3: return 150; break;
        case 4: return 100; break;
        case 5: return 50; break;
        default: return 150; break;
    }
}

///Definindo a velocidade da cobra
setInterval(() => { step(); show() }, vel(1)) //vel(1) to vel(5); default = vel(3)
