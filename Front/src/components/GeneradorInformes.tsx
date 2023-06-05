import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import FichajeMensual from "./GeneraInformes/FichajeMensual";
import RegHorasMensual from "./GeneraInformes/RegHorasMensual";

type TrabajoReg = {
    _id: string,
    tiempo: number;
    trabajoRealizado: string;
    Fdesde: string;
    comentario: string;
}

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

const GeneradorInformes: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {

    const [generador, setGenerador] = useState<string>("");

    const [terminoBuscado, setTerminoBuscado] = useState<string>("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState<string>("");

    const buscador = () => {
        if (terminoBuscado === "") setResultadoBusqueda("")
        else if ("Fichaje mensual" === terminoBuscado) setResultadoBusqueda("Fichaje mensual");
        else if ("Registro de horas mensual" === terminoBuscado) setResultadoBusqueda("Registro de horas mensual");
        else if (terminoBuscado !== "") setResultadoBusqueda("No se encontraron resultados");
    };

    return (
        <div className="flex h-full flex-1 flex-col md:pl-[190px]">
            {generador === "" &&
                <div>
                    <div className="flex items-center max-w-md mx-auto bg-white border border-gray-300 rounded-full overflow-hidden my-10 mb-10">
                        <input
                            type="text"
                            className="flex-grow px-4 py-2 bg-transparent outline-none"
                            placeholder="Buscar"
                            value={terminoBuscado}
                            onChange={(e) => setTerminoBuscado(e.target.value)}
                        />
                        <button className="flex-shrink-0 px-4 py-2 focus:outline-none" onClick={() => {
                            buscador();
                        }}>
                            <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                        </button>
                    </div>
                    {resultadoBusqueda === "" &&
                        <div>
                            <div className="mt-4 bg-gray-100 p-4 rounded">
                                <button className="my-4 mx-10" onClick={() => setGenerador("Fichaje mensual")}>Fichaje mensual</button><br></br>
                            </div>
                            <div className="mt-4 bg-gray-100 p-4 rounded">
                                <button className="my-4 mx-10" onClick={() => setGenerador("Registro de horas mensual")}>Registro de horas mensual</button><br></br>
                            </div>
                        </div>
                    }
                    {resultadoBusqueda &&
                        <div className="mt-4 bg-gray-100 p-4 rounded">
                            <button className="my-4 mx-10" onClick={() => setGenerador(resultadoBusqueda)}>{resultadoBusqueda}</button>
                        </div>
                    }
                </div>
            }
            {generador === "Fichaje mensual" &&
                <FichajeMensual reloadHandler={reloadHandler}></FichajeMensual>
            }
            {generador === "Registro de horas mensual" &&
                <RegHorasMensual reloadHandler={reloadHandler}></RegHorasMensual>
            }
        </div>
    )
}

export default GeneradorInformes;
