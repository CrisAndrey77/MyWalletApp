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

    editarUsurario(usuario: Usuario, key:any){
      return this.usuarioListaRef.update(key,usuario);
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

    filtrarGastoPorCategoria(email: string, categoria: string){
        var d = this.db.list('/gasto-lista', ref => ref.orderByChild('email_usuario').equalTo(email));
        return d.query.orderByChild('categoria').equalTo(categoria);
    }

    obtenerUsuarioPorEmail(ctxt: string): any {
        return(this.filtrarString(ctxt));
    }

    obtenerGastoPorUsuario(ctxt: string): any {
        return(this.filtrarStringEmail(ctxt));
    }

    obtenerGastoPorCategoria(email: string, categoria: string){
        return(this.filtrarGastoPorCategoria(email,categoria));
    }


    obtenerGastoPorUsuario2(ctxt: string): any {
        return(this.filtrarStringEmail2(ctxt));
    }

    filtrarStringEmail2(email: string) {
        return this.db.list('/gasto-lista', ref => ref.orderByChild('email_usuario').equalTo(email));
    }


}
