/*
  Clase Entrada
  Esta clase se utilizará para los objetos que manejan la información de las entradas
  del usuario
  Explicación de las variables:
  nombre : Nombre de la entrada (Por ejemplo : Comida domingo)
  descripción : Descripción de la entrada (es un campo opcional, ejemplo: Salí al cine y comimos)
 */

export class Entrada {
  constructor(nombre: string, descripcion: string, valor: number, idEstablecimiento: string, fecha: Date) {
    this._nombre = nombre;
    this._descripcion = descripcion;
    this._valor = valor;
    this._idEstablecimiento = idEstablecimiento;
    this._fecha = fecha;
  }

  private _nombre: string;

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  private _descripcion: string;

  get descripcion(): string {
    return this._descripcion;
  }

  set descripcion(value: string) {
    this._descripcion = value;
  }

  private _valor: number;

  get valor(): number {
    return this._valor;
  }

  set valor(value: number) {
    this._valor = value;
  }

  private _idEstablecimiento: string;

  get idEstablecimiento(): string {
    return this._idEstablecimiento;
  }

  set idEstablecimiento(value: string) {
    this._idEstablecimiento = value;
  }

  private _fecha: Date;

  get fecha(): Date {
    return this._fecha;
  }

  set fecha(value: Date) {
    this._fecha = value;
  }
}
