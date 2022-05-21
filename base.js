//Funções de apoio
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)

//corta array a partir segundo elemento
const dropFirst = xs => xs.slice(1)

//pega do primeiro elemento até o penúltimo
const dropLast  = xs => xs.slice(0, xs.length - 1)

const id        = x => x
const k         = x => y => x

//Mapear um array
const map       = f => xs => xs.map(f)

const mapi      = f => xs => xs.map((x, i) => f(x)(i))

//Copiar propriedades de um objeto para outro
const merge     = o1 => o2 => Object.assign({}, o1, o2)

const mod       = x => y => ((y % x) + x) % x

///Atribuindo um objeto
const objOf     = k => v => ({ [k]: v })

///Recebe várias funções e um valor X, e aplica essas funções acumulando
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

///Retorna um valor de um objeto dentro de um index
const prop = k => o => o[k]

///Gera um intervalos de números
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)

///Percorrendo todo range passado
const rep       = c => n => map(k(c))(range(0)(n))

///Gerando numeros aleatórios dentro de um intervalo
const rnd       = min => max => Math.floor(Math.random() * max) + min

///Responsável para atualizar o objeto toda vez que a cobra se movimenta
const spec      = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

module.exports = { adjust, dropFirst, dropLast, id, k, map, merge, mod, objOf, pipe, prop, range, rep, rnd, spec }
