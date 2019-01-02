import {Establecimiento} from "./Establecimiento";
import {Entrada} from "./Entrada";

export class Usuario {
  constructor(nombre: string, correo: string, ingresoMensual: number, id: string, registroDeEntradas: Map<string, Array<Entrada>>, establecimientos: Array<Establecimiento>) {
    this._nombre = nombre;
    this._correo = correo;
    this._ingresoMensual = ingresoMensual;
    this._id = id;
    this._registroDeEntradas = registroDeEntradas;
    this._establecimientos = establecimientos;
  }

  private _nombre: string;

  get nombre(): string {
    return this._nombre;
  }

  set nombre(value: string) {
    this._nombre = value;
  }

  private _correo: string;

  get correo(): string {
    return this._correo;
  }

  set correo(value: string) {
    this._correo = value;
  }

  private _ingresoMensual: number;

  get ingresoMensual(): number {
    return this._ingresoMensual;
  }

  set ingresoMensual(value: number) {
    this._ingresoMensual = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _registroDeEntradas: Map<string, Array<Entrada>>;

  get registroDeEntradas(): Map<string, Array<Entrada>> {
    return this._registroDeEntradas;
  }

  set registroDeEntradas(value: Map<string, Array<Entrada>>) {
    this._registroDeEntradas = value;
  }

  private _establecimientos: Array<Establecimiento>;

  get establecimientos(): Array<Establecimiento> {
    return this._establecimientos;
  }

  set establecimientos(value: Array<Establecimiento>) {
    this._establecimientos = value;
  }

  agregarEntrada(fechaActual: Date, entrada: Entrada) {
    let fechaIngreso: string = fechaActual.getMonth().toString() + fechaActual.getFullYear().toString();

    if (this.registroDeEntradas.has(fechaIngreso)) {
      let entradaTemp: Array<Entrada> = this.registroDeEntradas.get(fechaIngreso);
      entradaTemp.push(entrada);
      this.registroDeEntradas.set(fechaIngreso, entradaTemp);
    } else {
      this.registroDeEntradas.set(fechaIngreso, new Array<Entrada>(entrada));
    }
    let tempEstablecimiento: Establecimiento = new Establecimiento('', entrada.idEstablecimiento, 0);
    this.establecimientos =
      Establecimiento.incrementaRankingEstablecimiento(this.establecimientos, tempEstablecimiento);
  }
}
