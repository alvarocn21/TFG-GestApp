import React, { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const EDITUSER = gql`
mutation Mutation($correo: String, $contrasena: String, $telefono: String, $dni: String, $direccion: String) {
    editUser(correo: $correo, contrasena: $contrasena, telefono: $telefono, dni: $dni, direccion: $direccion) {
      _id
    }
  }
`

type Usuario = {
    horasSemanales: number;
    nombre: string;
    permisos: string;
    correo: string;
    telefono: string;
    apellido1: string;
    apellido2: string;
    turno: string;
    dni: string;
    direccion: string;
    cargo: string;
  }


const PerfilUsuario: FC<{
    reloadHandler: () => void;
    data: Usuario;
}> = ({ reloadHandler, data }) => {

    const [editUser] = useMutation(EDITUSER);

    const [contrasena, setContrasena] = useState<string>("");
    const [contrasena1, setContrasena1] = useState<string>("");
    const [correo, setCorreo] = useState<string >(data.correo);
    const [dni, setDni] = useState<string >(data.dni);
    const [direccion, setDireccion] = useState<string >(data.direccion);
    const [telefono, setTelefono] = useState<string >(data.telefono);
    const [cambio, setCambio] = useState<string >("");

    return (
        <div className="h-full">
            {data &&
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center">
                        <div className="mt-2 bg-primary text-white w-20 h-20 flex items-center justify-center rounded-full" style={{ pointerEvents: 'none' }}>
                            <span className="text-2xl font-bold">{data.nombre[0].toUpperCase()}{data.apellido1[0].toUpperCase()}{data.apellido2[0].toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">Nombre Completo</div>
                        <p className="text-gray-700 mb-4">{data.nombre + " " + data.apellido1 + " " + data.apellido2}</p>
                        <div className="font-bold text-xl mb-2">DNI</div>
                        <p className="text-gray-700 mb-4">{data.dni}
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambio("DNI")}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                            {cambio === "DNI" &&
                                <div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Nuevo DNI
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="text"
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value)}
                                        ></input>
                                    </div>
                                    <button className="m-2 hover:bg-slate-300 text-white font-bold py-2 px-2 rounded transition-colors duration-300 bg-black" onClick={()=> {
                                        if (dni.length === 9) {
                                            editUser({
                                                variables: {
                                                    contrasena,
                                                    dni,
                                                    correo,
                                                    direccion,
                                                    telefono,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                setCambio("")
                                                reloadHandler();
                                            })

                                        } else window.alert("El DNI debe tener minimo 9 caracteres");
                                    }}>Aceptar</button>
                                </div>
                            }
                        </p>
                        <div className="font-bold text-xl mb-2">Correo</div>
                        <p className="text-gray-700 mb-4">{data.correo}
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambio("Correo")}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                            {cambio === "Correo" &&
                                <div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Nuevo Correo
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="text"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                        ></input>
                                    </div>
                                    <button className="m-2 hover:bg-slate-300 text-white font-bold py-2 px-2 rounded transition-colors duration-300 bg-black" onClick={() => {
                                        if (correo.includes("@") && correo !== "@") {
                                            editUser({
                                                variables: {
                                                    contrasena,
                                                    dni,
                                                    correo,
                                                    direccion,
                                                    telefono,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                setCambio("")
                                                reloadHandler();
                                            })

                                        } else window.alert("El nuevo correo no existe");
                                    }}>Aceptar</button>
                                </div>
                            }
                        </p>
                        <div className="font-bold text-xl mb-2">Contraseña</div>
                        <p className="text-gray-700 mb-4">*************
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambio("Contraseña")}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                            {cambio === "Contraseña" &&
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
                                    <button className="m-2 hover:bg-slate-300 text-white font-bold py-2 px-2 rounded transition-colors duration-300 bg-black" onClick={() => {
                                        if (contrasena === contrasena1 && contrasena !== "") {
                                            editUser({
                                                variables: {
                                                    contrasena,
                                                    dni,
                                                    correo,
                                                    direccion,
                                                    telefono,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                setCambio("")
                                                reloadHandler();
                                            })

                                        } else window.alert("Las contraseñas no coinciden o no estan rellenas");
                                    }}>Aceptar</button>
                                </div>
                            }
                        </p>
                        <div className="font-bold text-xl mb-2">Telefono</div>
                        <p className="text-gray-700 mb-4">{data.telefono}
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambio("Telefono")}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                            {cambio === "Telefono" &&
                                <div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Nuevo Telefono
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="text"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                        ></input>
                                    </div>
                                    <button className="m-2 hover:bg-slate-300 text-white font-bold py-2 px-2 rounded transition-colors duration-300 bg-black" onClick={() => {
                                        if (telefono.length === 9) {
                                            editUser({
                                                variables: {
                                                    contrasena,
                                                    dni,
                                                    correo,
                                                    direccion,
                                                    telefono,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                setCambio("")
                                                reloadHandler();
                                            })

                                        } else window.alert("El telefono debe llevar 9 digitos");
                                    }}>Aceptar</button>
                                </div>
                            }
                        </p>
                        <div className="font-bold text-xl mb-2">Direccion</div>
                        <p className="text-gray-700 mb-4">{data.direccion}<button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => setCambio("Direccion")}>
                            <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                        </button>
                            {cambio === "Direccion" &&
                                <div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Nueva Direccion
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="text"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                        ></input>
                                    </div>
                                    <button className="m-2 hover:bg-slate-300 text-white font-bold py-2 px-2 rounded transition-colors duration-300 bg-black" onClick={() => {
                                        editUser({
                                            variables: {
                                                contrasena,
                                                dni,
                                                correo,
                                                direccion,
                                                telefono,
                                            },
                                            context: {
                                                headers: {
                                                    authorization: localStorage.getItem("token")
                                                }
                                            }
                                        }).then(() => {
                                            setCambio("")
                                            reloadHandler();
                                        })
                                    }}>Aceptar</button>
                                </div>
                            }
                        </p>
                        <div className="font-bold text-xl mb-2">Horas Semanales</div>
                        <p className="text-gray-700 mb-4">{data.horasSemanales}</p>
                        <div className="font-bold text-xl mb-2">Turno</div>
                        <p className="text-gray-700 mb-4">{data.turno}</p>
                        <div className="font-bold text-xl mb-2">Cargo</div>
                        <p className="text-gray-700 mb-4">{data.cargo}</p>
                    </div>
                </div>

            }
        </div>
    )
}


export default PerfilUsuario;