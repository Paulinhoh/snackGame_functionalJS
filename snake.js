/// Chamando o arquivo basejs para poder utilizar suas funções
const base = require('./base')

Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// Constantes de movimentação
const NORTH = { x: 0, y:-1 } //subindo
const SOUTH = { x: 0, y: 1 } //descendo
const EAST  = { x: 1, y: 0 } //para direita
const WEST  = { x:-1, y: 0 } //para esquerda 

//Verificando se dois pontos são iguais
const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y

// Funções de ações
//verifica se a posição da cabeça da cobra é igual a posição da maçã
const willEat   = state => pointEq(nextHead(state))(state.apple) 

//verifica se a posição da cabeça da cobra é a mesma posição de alguma parte do corpo
const willCrash = state => state.snake.find(pointEq(nextHead(state))) 

//Valida se a cobra está em movimentação
const validMove = move => state =>
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0 

// Próximos valores baseados no estado atual
// gerando as proximas movimentações da cobra, ou seja, sempre percorrendo a lista de movimentação
const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves

///Caso a cobra coma a maçã atual, ele gera uma nova maçã em uma diferente posição, caso contrário, ela permanece na mesma posição
const nextApple = state => willEat(state) ? rndPos(state) : state.apple

///Verificando onde ta á nova posição da cabeça da cobra
const nextHead  = state => state.snake.length == 0
  ? { x: 2, y: 2 }
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
  }

///Verificando uma próxima cobra
const nextSnake = state => willCrash(state)
  //caso tenha uma colisão, você perdeu o jogo
  ? []
  //depois verifica se comeu alguma maçã
  : (willEat(state)
    //a cobra vai aumentar
    ? [nextHead(state)].concat(state.snake)
    //aqui ele sempre vai diminuindo a ultima parte da cobra, ou seja, para não adicionar
    : [nextHead(state)].concat(dropLast(state.snake)))

// Aleatoriedade
//gera posições de x e y aleatórios dentro do range do mapa (linhas e colunas)
const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})

// Estado Inicial: Valores pré-definidos para os objetos que componham um estado
const initialState = () => ({
  cols:  20,
  rows:  14,
  moves: [EAST],
  snake: [],
  apple: { x: 16, y: 2 },
})

//Atualizando todos os objetos do jogo de acordo com o tempo e ocorrência de eventos
const next = spec({
  rows:  prop('rows'),
  cols:  prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple
})

/// Responsável para fazer a cobra se movimentar
const enqueue = (state, move) => validMove(move)(state)
  ? 
  //caso a movimentação seja válida, ele copia suas propriedades para um novo objeto
  merge(state)({ moves: state.moves.concat([move]) })
  //caso a movimentação não seja válida, ele não altera o estado
  : state

/// Expotando as funções
module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
