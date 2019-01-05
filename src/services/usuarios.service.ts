import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Usuario } from './../models/usuario.model';
import { Gasto } from './../models/gasto.model';

@Injectable()
export class UsuariosServicio {

    private usuarioListaRef = this.db.list<Usuario>('usuario-lista');
    private gastoListaRef = this.db.list<Gasto>('gasto-lista');
    private usuario: Usuario;
    private gasto: Gasto;

    constructor(private db: AngularFireDatabase) {}



    agregarUsuario(usuario: Usuario) {
        return this.usuarioListaRef.push(usuario);
    }

    agregarGasto(gasto: Gasto) {
        return this.gastoListaRef.push(gasto);
    }

    filtrarString(correo: string) {
        return this.db.list('/usuario-lista', ref => ref.orderByChild('correo').equalTo(correo));
    }

    filtrarStringEmail(email: string) {
        return this.db.list('/gasto-lista', ref => ref.orderByChild('email_usuario').equalTo(email));
    }

    obtenerUsuarioPorEmail(ctxt: string): any {
        return(this.filtrarString(ctxt));
    }

    obtenerGastoPorUsuario(ctxt: string): any {
        return(this.filtrarStringEmail(ctxt));
    }

}