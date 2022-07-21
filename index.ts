type CasoTeste = {
  entradas: number[],
  saida: number
}

class Neuronio {

  bias: number = 0
  passo: number = 0.1
  pesos: number[] = [ 1, 1 ]

  constructor(bias: number = 0, pesos: number[] = [ 1, 1 ]) {
    this.bias = bias
    this.pesos = pesos
  }

  /**
   * Clona o neuronio atual
   */
  public clonar() {
    return new Neuronio(this.bias, this.pesos)
  }

  /**
   * "Normaliza" o valor passado 
   */
  private ativar(valor: number) {
    return valor > 0 ? 1 : 0
  }

  /**
   * Retorna o resultado da função de ativação passado o valor da soma dos
   * pesos * entradas * erro
   */
  private saida(entradas: number[]) {
    const soma = this.pesos.reduce((acc, peso, indice) => acc + (peso * entradas[indice]), this.bias)
    return this.ativar(soma)
  }

  /**
   * Ajusta os pesos e o bias para uma nova testagem
   */
  private ajustar(entradas: number[], erro: number) {
    this.pesos = this.pesos.map((peso, indice) => peso + (erro * this.passo * entradas[indice]))
    this.bias += erro * this.passo
  }

  testarCaso = ({ entradas, saida }: CasoTeste) => {
    const soma = this.saida(entradas)
    if (soma === saida)
      return true

    this.ajustar(entradas, saida - soma)
    return false
  }
}

type TreinoArgs = {
  valores: CasoTeste[],
  maxEpocas?: number,
  neuronio?: Neuronio
}

const treinar = ({ valores, neuronio = new Neuronio, maxEpocas = 0 }: TreinoArgs): { epocas: number, neuronio: Neuronio } => {
  let epocas = 1
  while (!valores.every(neuronio.testarCaso)) {
    if (maxEpocas && epocas === maxEpocas) {
      break
    }

    epocas++
  }

  return { epocas, neuronio }
}

const CONDICIONAL_E = [
  { entradas: [ 1, 1 ], saida: 1 },
  { entradas: [ 1, 0 ], saida: 0 },
  { entradas: [ 0, 1 ], saida: 0 },
  { entradas: [ 0, 0 ], saida: 0 }
]

const CONDICIONAL_OU = [
  { entradas: [ 1, 1 ], saida: 1 },
  { entradas: [ 1, 0 ], saida: 1 },
  { entradas: [ 0, 1 ], saida: 1 },
  { entradas: [ 0, 0 ], saida: 0 }
]

const CONDICIONAL_OU_EXCLUSIVO = [
  { entradas: [ 1, 1 ], saida: 0 },
  { entradas: [ 1, 0 ], saida: 1 },
  { entradas: [ 0, 1 ], saida: 1 },
  { entradas: [ 0, 0 ], saida: 0 }
]

const treinamentoE = treinar({
  valores: [ ...CONDICIONAL_E ]
})

const treinamentoOU = treinar({
  valores: [ ...CONDICIONAL_OU ]
})

const treinamentoOU_NEURONIO_E = treinar({
  valores: [ ...CONDICIONAL_OU ],
  neuronio: treinamentoE.neuronio.clonar()
})

const treinamentoOU_EXCLUSIVO = treinar({
  valores: [ ...CONDICIONAL_OU_EXCLUSIVO ],
  maxEpocas: 2000
})

console.log({ nome: 'Treinamento condicional E', ...treinamentoE })
console.log({ nome: 'Treinamento condicional OU', ...treinamentoOU })
console.log({ nome: 'Treinamento condicional OU com neuronio treinado do E', ...treinamentoOU_NEURONIO_E })
console.log({ nome: 'Treinamento condicional OU EXCLUSIVO', ...treinamentoOU_EXCLUSIVO })