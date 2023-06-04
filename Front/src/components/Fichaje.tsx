import React, { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

type Fichajes = {
    _id: string;
    fecha: string;
    entradasSalidas: string;
    comentario: string;
}

const FICHAJE = gql`
mutation Mutation($hora: String!, $comentario: String!) {
    setFichaje(hora: $hora, comentario: $comentario) {
      fecha
    }
  }
`

const EDIT_FICHAJE = gql`
mutation Mutation($editFichajeId: String, $hora: String, $comentario: String) {
    editFichaje(_id: $editFichajeId, hora: $hora, comentario: $comentario) {
      _id
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
      comentario
      entradasSalidas
      fecha
    }
  }
`

const Fichaje: FC<{
    reloadHandler: () => void;
    horasSemanales: number | undefined;
}> = ({ reloadHandler, horasSemanales }) => {
    const [pantalla, setPantalla] = useState<number>(0);
    const [hora, setHora] = useState<string>("");
    const [comentario, setComentario] = useState<string>("");
    const [id, setId] = useState<string>("");

    const [fichaje] = useMutation(FICHAJE);
    const [editFichaje] = useMutation(EDIT_FICHAJE);
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
        <div className="flex h-full flex-1 flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => setPantalla(1)}>
                        Fichar
                    </button>
                    {horasSemanales &&
                        <div className="p-4 font-serif">Horas al dia: {horasSemanales / 5}</div>
                    }
                    <div className="underline underline-offset-1 mx-5">Marcajes</div>
                    <div className="grid grid-cols-2 mx-5">
                        {data?.getFichaje.map((e) => (
                            <div>
                                {data.getFichaje.indexOf(e) % 2 === 0 &&
                                    <div className="m-5 border-colapse h-52 w-48 border-2 border-black text bg-amber-100 border-double p-2">
                                        <div className="font-bold">Entrada</div>
                                        <div className="font-bold">Hora</div> {e.entradasSalidas}
                                        <div className="font-bold">Motivo</div>
                                        <div className="p-2">{e.comentario}</div>
                                        <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                            setHora(e.entradasSalidas);
                                            setComentario(e.comentario);
                                            setId(e._id);
                                            setPantalla(2);
                                        }}>
                                            <svg style={{fill: 'black'}} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                                        </button>
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
                                        }}><svg style={{fill: 'black'}} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg></button>
                                    </div>
                                }
                                {data.getFichaje.indexOf(e) % 2 !== 0 &&
                                    <div className="m-5 border-colapse h-52 w-48 border-2 border-black text bg-amber-100 border-double p-2">
                                        <div className="font-bold">Salida</div>
                                        <div className="font-bold">Hora</div> {e.entradasSalidas}
                                        <div className="font-bold">Motivo</div>
                                        <div className="p-2">{e.comentario}</div>
                                        <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                            setHora(e.entradasSalidas);
                                            setComentario(e.comentario);
                                            setId(e._id);
                                            setPantalla(2);
                                        }}>
                                            <svg style={{fill: 'black'}} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                                        </button>
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
                                        }}><svg style={{fill: 'black'}} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
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
                    }}>atras</button>
                    <div className="flex justify-start p-4 underline underline-offset-1 font-serif">Añade la hora de entrada/salida</div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Hora Inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Motivo
                        </span>
                        <select onChange={(e) => setComentario(e.target.value)} className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1">
                            <option></option>
                            <option value="Entrada/Salida">Entrada/Salida</option>
                            <option value="Asuntos personales">Asuntos personales</option>
                            <option value="Pausa">Pausa</option>
                        </select>
                    </div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        if (hora === "") {
                            window.alert("Tienes que añadir una hora primero")
                        } else if (comentario === "") {
                            window.alert("Tienes que marcar un motivo")
                        } else {
                            if (data?.getFichaje && data?.getFichaje.length > 0) {
                                const horasMarca = data.getFichaje[data.getFichaje.length - 1].entradasSalidas[0] + data?.getFichaje[data.getFichaje.length - 1].entradasSalidas[1];
                                const minutosMarca = data.getFichaje[data.getFichaje.length - 1].entradasSalidas[3] + data?.getFichaje[data.getFichaje.length - 1].entradasSalidas[4];
                                if (horasMarca > (hora[0] + hora[1]) || (horasMarca === hora[0] + hora[1] && minutosMarca >= hora[0] + hora[1])) {
                                    window.alert("Estas añadiendo una hora inferior a tu anterior marcaje.")
                                } else {
                                    fichaje({
                                        variables: {
                                            hora,
                                            comentario
                                        },
                                        context: {
                                            headers: {
                                                authorization: localStorage.getItem("token")
                                            }
                                        }
                                    }).then(() => {
                                        setHora("");
                                        setComentario("");
                                        setPantalla(0)
                                        reloadHandler();
                                    });
                                }
                            } else {
                                fichaje({
                                    variables: {
                                        hora,
                                        comentario
                                    },
                                    context: {
                                        headers: {
                                            authorization: localStorage.getItem("token")
                                        }
                                    }
                                }).then(() => {
                                    setHora("");
                                    setComentario("");
                                    setPantalla(0)
                                    reloadHandler();
                                });
                            }
                        }
                    }}>Aceptar</button><br></br><br></br>
                </div>
            }
            {pantalla === 2 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>atras</button>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Hora Inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Motivo
                        </span>
                        <select onChange={(e) => setComentario(e.target.value)} className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1">
                            <option value="Entrada/Salida">Entrada/Salida</option>
                            <option value="Asuntos personales">Asuntos personales</option>
                            <option value="Pausa">Pausa</option>
                        </select>
                    </div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        editFichaje({
                            variables: {
                                editFichajeId: id,
                                hora,
                                comentario,
                            },
                            context: {
                                headers: {
                                    authorization: localStorage.getItem("token")
                                }
                            }

                        }).then(() => {
                            setHora("");
                            setComentario("");
                            setPantalla(0);
                            reloadHandler();
                        });
                    }}>Aceptar</button>
                </div>
            }
        </div>
    )
}

export default Fichaje;