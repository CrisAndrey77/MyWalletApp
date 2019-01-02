/*
  Clase establecimiento,
  Esta clase se utilzará para almacenar los objetos que representan al establecimiento
  en donde se realizó la compra
  Descripción de las variables:
  nombre : Nombre del local (tomada del parametro name de Google Places)
  id : ID del local (tomada del parametro place_id de Google Places)
  ranking : Ranking del establecimiento para el usuario actual, se incrementa cada
  vez que se ingrese una entrada en el establecimiento.
 */

export class Establecimiento {
  constructor(nombre: string, id: string, ranking: number) {
    this._nombre = nombre;
    this._id = id;
    this._ranking = ranking;
  }

  private _nombre: string;

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _ranking: number;

  get ranking(): number {
    return this._ranking;
  }

  set ranking(value: number) {
    this._ranking = value;
  }

  //Busca en la lista por el establecimiento con el ID del establecimiento pasado por parametro, si lo encuentra,
  // incrementa su ranking en 1 punto, de lo contrario lo agrega a la lista.

  static ordenaListaPorRanking(lista: Array<Establecimiento>) {
    lista.sort((establecimientoA: Establecimiento, establecimientoB: Establecimiento) => {
      if (establecimientoA.ranking > establecimientoB.ranking) {
        return 1;
      }
      if (establecimientoA.ranking < establecimientoB.ranking) {
        return 1;
      }
      return 0;
    });
    return lista;
  }

  // (con el valor mínimo siendo 1), esto con el objetivo de no manejar números muy grandes.
  static optimizaRanking(lista: Array<Establecimiento>) {
    let resultado: Array<Establecimiento> = Establecimiento.ordenaListaPorRanking(lista);

    let tamano: number = resultado.length;
    for (let i: number = 0; i < tamano; i++) {
      if (resultado[i].ranking > 10) {
        resultado[i].ranking = resultado[i].ranking / 10;
      } else {
        resultado[i].ranking = 1;
      }
    }
    return resultado;
  }

  //Si algún establecimiento llega a tener un ranking de 100, se dividirán todos los rankings de la lista entre 10

  static obtenerTopN(n: number, lista: Array<Establecimiento>) {
    let resultado: Array<Establecimiento> = new Array<Establecimiento>();
    let tamano: number = lista.length;
    if (n > tamano) {
      n = tamano;
    }
    for (let i: number = 0; i < n; i++) {
      resultado[i] = lista[i];
    }
    return resultado;
  }

  //A la hora de incrementar el ranking, si este supera los 100 puntos, pasa por un proceso de "optimización"
  static incrementaRankingEstablecimiento(lista: Array<Establecimiento>, establecimientoAumentar: Establecimiento) {
    let tamano: number = lista.length;
    for (let i: number = 0; i < tamano; i++) {
      let tempEstablecimiento: Establecimiento = lista[i];
      if (tempEstablecimiento.id === establecimientoAumentar.id) {
        tempEstablecimiento.ranking = tempEstablecimiento.ranking + 1;
        lista[i] = tempEstablecimiento;
        if (tempEstablecimiento.ranking) {
          return Establecimiento.optimizaRanking(lista);
        }
        return lista;
      }
    }
    lista.push(establecimientoAumentar);
    return lista;
  }
}
