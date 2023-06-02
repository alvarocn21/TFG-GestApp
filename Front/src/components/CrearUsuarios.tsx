import React, { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREAUSER = gql`
mutation Mutation($nombre: String, $apellido1: String, $apellido2: String, $telefono: String, $contrasena: String, $correo: String, $horasSemanales: Float, $diasHabiles: Float, $cargo: String) {
    createUser(nombre: $nombre, apellido1: $apellido1, apellido2: $apellido2, telefono: $telefono, contrasena: $contrasena, correo: $correo, horasSemanales: $horasSemanales, diasHabiles: $diasHabiles, cargo: $cargo) {
      _id
    }
  }
`

const CrearUsuarios: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {

    const [nombre, setNombre] = useState<string>("");
    const [apellido1, setApellido1] = useState<string>("");
    const [apellido2, setApellido2] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");
    const [dni, setDni] = useState<string>("");
    const [direccion, setDireccion] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [horasSemanales, setHorasSemanales] = useState<number>(0);
    const [diasHabiles, setDiasHabiles] = useState<number>(0);
    const [cargo, setcargo] = useState<string>("Usuario");

    const [createUser] = useMutation(CREAUSER);

    return (
        <div>
            <div className="flex h-full flex-1 flex-col md:pl-[190px]">
                <div className="flex justify-start p-4 underline underline-offset-1 font-serif">Crear usuario</div>
                <div className="grid grid-cols-2 mx-5">
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Nombre
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        /></div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Primer apellido
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={apellido1}
                            onChange={(e) => setApellido1(e.target.value)}
                        /></div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Segundo Apellido
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={apellido2}
                            onChange={(e) => setApellido2(e.target.value)}
                        /></div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Telefono
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        /></div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Contraseña
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        /></div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Correo
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        /></div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Horas semanales
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="number"
                            value={horasSemanales}
                            onChange={(e) => setHorasSemanales(e.target.valueAsNumber)}
                        /></div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Numero de dias habiles del empleado
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="number"
                            value={diasHabiles}
                            onChange={(e) => setDiasHabiles(e.target.valueAsNumber)}
                        />
                    </div >
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            DNI
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                        /></div >
                         <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Numero de la Seguridad Social
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                        /></div >
                    <div className="block mx-4">
                        <label className="label cursor-pointer">
                            <span className="block text-sm font-medium text-slate-700 mt-5">Usuario</span>
                            <input type="radio" name="radio-10" className="radio checked:bg-blue-500 m-1" checked onChange={() => setcargo("Usuario")} />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="block text-sm font-medium text-slate-700 mt-5">Administrador</span>
                            <input type="radio" name="radio-10" className="radio checked:bg-red-500 m-1" onChange={() => setcargo("Administrador")} />
                        </label>
                    </div>
                </div>
            </div>
            <button className="glass p-2 bg-amber-700 btn-group mx-56 my-10" onClick={() => {
                if (nombre === "" || apellido1 === "" || apellido2 === "" || telefono === "" || contrasena === "" || correo === "" || horasSemanales === 0 || cargo === "") {
                    window.alert("Falta por añadir algun campo OBLIGATORIO");
                } else {
                    createUser({
                        variables: {
                            nombre: nombre,
                            apellido1: apellido1,
                            apellido2: apellido2,
                            telefono: telefono,
                            contrasena: contrasena,
                            correo: correo,
                            horasSemanales: horasSemanales,
                            diasHabiles: diasHabiles,
                            cargo: cargo,
                            dni: dni,
                            direccion: direccion
                        },
                        context: {
                            headers: {
                                authorization: localStorage.getItem("token")
                            }
                        }
                    }).then(() => {
                        setNombre("");
                        setApellido1("");
                        setApellido2("");
                        setTelefono("");
                        setContrasena("");
                        setCorreo("");
                        setHorasSemanales(0);
                        setDiasHabiles(0);
                        setcargo("Usuario")
                        reloadHandler();
                    });
                }
            }}
            >Crear Usuario</button>
        </div>
    )
}


export default CrearUsuarios;