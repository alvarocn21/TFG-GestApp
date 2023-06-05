import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const GETUSERS = gql`
query Query {
    getUsers {
        diasHabiles
        horasSemanales
        _id
        nombre
        cargo
        correo
        telefono
        apellido1
        apellido2
        dni
        direccion
    }
  }
`
const EDITUSERADMIN = gql`
mutation Mutation($id: String, $correo: String, $contrasena: String) {
    editUserAdmin(_id: $id, correo: $correo, contrasena: $contrasena) {
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

const PerfilesUsuariosAdmin: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {

    const [editUser] = useMutation(EDITUSERADMIN);

    const [cambiarPDW, setCambiarPDW] = useState<boolean>(false);
    const [correo, setCorreo] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");
    const [contrasena1, setContrasena1] = useState<string>("");
    const [idPersona, setIdPersona] = useState<string>("");

    const { data, loading, error } = useQuery<{ getUsers: Usuario[] }>(
        GETUSERS,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    if (loading) return <div>Loading...</div>;
    if (data && error) return <div>Error :(</div>;

    return (
        <div className="flex h-full flex-1 flex-col md:pl-[190px] m-10">
            {data &&
                <div>
                    {data.getUsers.map((e: Usuario) => (
                        <div key={e._id}>
                            <div>
                                DNI: {e.dni}
                            </div>
                            <div>
                                correo: {e.correo}
                            </div>
                            <div>
                                contraseña: **********
                            </div>
                            <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                setCambiarPDW(!cambiarPDW);
                                setIdPersona(e._id)
                                setContrasena("")
                                setContrasena1("")
                                setCorreo("")
                            }}>
                                <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                            </button>
                            {cambiarPDW && idPersona === e._id &&
                                <div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Correo nuevo
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="text"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className="block mx-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                                            Contraseña nueva
                                        </span>
                                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                                            type="password"
                                            value={contrasena}
                                            placeholder="**********"
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
                                            placeholder="**********"
                                            onChange={(e) => setContrasena1(e.target.value)}
                                        ></input>
                                    </div>
                                    <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                        if (contrasena === contrasena1) {
                                            if (correo !== "") {
                                                editUser({
                                                    variables: {
                                                        id: e._id,
                                                        correo: correo,
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
                                                    setCorreo("")
                                                    setCambiarPDW(false)
                                                    reloadHandler();
                                                })

                                            } else {
                                                editUser({
                                                    variables: {
                                                        id: e._id,
                                                        correo: e.correo,
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
                                                    setCorreo("")
                                                    setCambiarPDW(false)
                                                    reloadHandler();
                                                })
                                            }
                                        } else window.alert("Las contraseñas no coinciden o no estan rellenas");
                                    }}>Aceptar</button>
                                </div>
                            }
                            <br /> <br />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default PerfilesUsuariosAdmin;
