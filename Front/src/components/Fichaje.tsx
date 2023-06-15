import React, { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

type Fichajes = {
    _id: string;
    fecha: string;
    hora: string;
    motivo: string;
}

const FICHAJE = gql`
mutation Mutation($motivo: String!) {
    setFichaje(motivo: $motivo) {
      fecha
    }
  }
`

const DELETE_FICHAJE = gql`
mutation Mutation($deleteFichajeId: String) {
    deleteFichaje(_id: $deleteFichajeId) {
      _id
    }
  }
`

const GET_FICHAJE = gql`
query Query {
    getFichaje {
      _id
      motivo
      hora
      fecha
    }
  }
`

const Fichaje: FC<{
    reloadHandler: () => void;
    horasSemanales: number;
}> = ({ reloadHandler, horasSemanales }) => {
    const [pantalla, setPantalla] = useState<number>(0);
    const [motivo, setMotivo] = useState<string>("");

    const [fichaje] = useMutation(FICHAJE);
    const [deleteFichaje] = useMutation(DELETE_FICHAJE);

    const { data, loading, error } = useQuery<{ getFichaje: Fichajes[] }>(
        GET_FICHAJE,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            },
        }
    );

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error...</div>

    return (
        <div className="flex h-screen flex-1 flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <button className=" text-lg border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => setPantalla(1)}>
                        Fichar
                    </button>
                    {horasSemanales &&
                        <div className="p-4 text-lg font-serif">Horas al dia: {horasSemanales / 5}</div>
                    }
                    <div className="underline underline-offset-1 text-lg mx-5">Marcajes</div>
                    <div className="grid grid-cols-2 mx-5">
                        {data?.getFichaje.map((e) => (
                            <div key={"Entrada"+e._id}>
                                {data.getFichaje.indexOf(e) % 2 === 0 &&
                                    <div className="m-10 border-colapse h-52 w-48 border-2 border-slate-400 text bg-amber-100 border-double p-2">
                                        <div className="font-bold">Entrada</div>
                                        <div className="font-bold">Hora</div> {e.hora}
                                        <div className="font-bold">Motivo</div>
                                        <div className="p-2">{e.motivo}</div>
                                        <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                            deleteFichaje({
                                                variables: {
                                                    deleteFichajeId: e._id,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                reloadHandler();
                                            });
                                        }}><svg style={{ fill: 'black' }}  height="1em" viewBox="0 0 448 512">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg></button>
                                    </div>
                                }
                                {data.getFichaje.indexOf(e) % 2 !== 0 &&
                                    <div className="m-10 border-colapse h-52 w-48 border-2 border-slate-400 text bg-amber-100 border-double p-2">
                                        <div className="font-bold">Salida</div>
                                        <div className="font-bold">Hora</div> {e.hora}
                                        <div className="font-bold">Motivo</div>
                                        <div className="p-2">{e.motivo}</div>
                                        <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                            deleteFichaje({
                                                variables: {
                                                    deleteFichajeId: e._id,
                                                },
                                                context: {
                                                    headers: {
                                                        authorization: localStorage.getItem("token")
                                                    }
                                                }
                                            }).then(() => {
                                                reloadHandler();
                                            });
                                        }}><svg style={{ fill: 'black' }}  height="1em" viewBox="0 0 448 512">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg></button>
                                    </div>
                                }
                            </div>

                        ))}
                    </div>
                </div>
            }
            <br></br>
            {pantalla === 1 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>&lt;</button>
                    <div className="flex justify-start p-4 underline underline-offset-1 font-serif text-lg m-10">Añade la hora de entrada/salida</div>
                    <div className="block mx-4">
                        <span className="after:content-['*']  after:ml-0.5 after:text-red-500 block text-lg m-10 font-medium text-slate-700 mt-5">
                            Motivo
                        </span>
                        <select onChange={(e) => setMotivo(e.target.value)} className="m-10 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1">
                            <option value=""></option>
                            <option value="Entrada/Salida">Entrada/Salida</option>
                            <option value="Asuntos personales">Asuntos personales</option>
                            <option value="Pausa">Pausa</option>
                        </select>
                    </div>
                    <button className="border-black-300 border-2 m-10 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        if (motivo === "") {
                            window.alert("Tienes que marcar un motivo")
                        } else {
                            fichaje({
                                variables: {
                                    motivo
                                },
                                context: {
                                    headers: {
                                        authorization: localStorage.getItem("token")
                                    }
                                }
                            }).then(() => {
                                setMotivo("");
                                setPantalla(0);
                                reloadHandler();
                            });
                        }
                    }}>Aceptar</button><br></br><br></br>
                </div>
            }
        </div>
    )
}

export default Fichaje;