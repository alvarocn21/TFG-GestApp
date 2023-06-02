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
        <div className="flex h-full flex-1 flex-col md:pl-[190px]">
            {data &&
                <div>
                    <div className="bg-primary text-white w-20 h-20 flex items-center justify-center rounded-full" style={{ pointerEvents: 'none' }}>
                        <span className="text-5xl font-bold">{data.nombre[0].toUpperCase()}</span>
                    </div>
                    <div> DNI:
                        {data.dni}
                    </div>
                    <div> Nombre:
                        {data.nombre} {data.apellido1} {data.apellido2}
                    </div>
                    <div> Correo:
                        {data.correo}
                    </div>
                    <div> Contraseña:
                        ****************
                        <button className="btn btn-primary" onClick={() => setCambiarPDW(!cambiarPDW)}></button>

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
                                        Contraseña nueva
                                    </span>
                                    <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                        type="password"
                                        value={contrasena1}
                                        onChange={(e) => setContrasena1(e.target.value)}
                                    ></input>
                                </div>
                                <button className="btn btn-primary flex items-center" onClick={() => {
                                    console.log(contrasena)
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
                                }}></button>
                            </div>
                        }
                    </div>
                    <div> Direccion:
                        {data.direccion}
                    </div>
                    <div> Jornada laboral:
                        {data.horasSemanales} horas/semanales
                    </div>
                    <div> Dias habiles disponibles:
                        {data.diasHabiles}
                    </div>
                </div>

            }
        </div >
    )
}


export default PerfilUsuario;