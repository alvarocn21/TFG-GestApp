import React, { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const EDITUSER = gql`
mutation Mutation($contrasena: String) {
    editUser(contrasena: $contrasena) {
      _id
    }
  }
`

type Usuario = {
    diasHabiles: number;
    horasSemanales: number;
    _id: string;
    nombre: string;
    cargo: string;
    correo: string;
    telefono: string;
    apellido1: string;
    apellido2: string;
    dni: String;
    direccion: String;
}


const PerfilUsuario: FC<{
    reloadHandler: () => void;
    data: Usuario | undefined;
}> = ({ reloadHandler, data }) => {

    const [editUser] = useMutation(EDITUSER);
    const [contrasena, setContrasena] = useState<string>("");
    const [contrasena1, setContrasena1] = useState<string>("");
    const [cambiarPDW, setCambiarPDW] = useState<boolean>(false);

    return (
        <div>
            {data &&
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center">
                        <div className="bg-primary text-white w-20 h-20 flex items-center justify-center rounded-full" style={{ pointerEvents: 'none' }}>
                            <span className="text-5xl font-bold">{data.nombre[0].toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Nombre Completo</div>
                        <p className="text-gray-700 mb-4">{data.nombre + " " + data.apellido1 + " " + data.apellido2}</p>
                        <div className="font-bold text-xl mb-2">DNI</div>
                        <p className="text-gray-700 mb-4">{data.dni}</p>
                        <div className="font-bold text-xl mb-2">Correo</div>
                        <p className="text-gray-700 mb-4">{data.correo}</p>
                        <div className="font-bold text-xl mb-2">Contraseña</div>
                        <p className="text-gray-700 mb-4">*************
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambiarPDW(!cambiarPDW)}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                        </p>
                        {cambiarPDW &&
                            <div>
                                <div className="block mx-4">
                                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                        Contraseña nueva
                                    </span>
                                    <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                        type="password"
                                        value={contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                    ></input>
                                </div>
                                <div className="block mx-4">
                                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                        Repetir contraseña
                                    </span>
                                    <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                        type="password"
                                        value={contrasena1}
                                        onChange={(e) => setContrasena1(e.target.value)}
                                    ></input>
                                </div>
                                <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                    if (contrasena === contrasena1 && contrasena !== "") {
                                        editUser({
                                            variables: {
                                                contrasena: contrasena
                                            },
                                            context: {
                                                headers: {
                                                    authorization: localStorage.getItem("token")
                                                }
                                            }
                                        }).then(() => {
                                            setContrasena("")
                                            setContrasena1("")
                                            setCambiarPDW(false)
                                            reloadHandler();
                                        })

                                    } else window.alert("Las contraseñas no coinciden o no estan rellenas");
                                }}>Aceptar</button>
                            </div>
                        }
                    </div>
                </div>

            }
        </div>
    )
}


export default PerfilUsuario;