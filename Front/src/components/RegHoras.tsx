import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

type TrabajoReg = {
    _id: string,
    tiempo: number;
    trabajoRealizado: string;
    Fdesde: string;
    comentario: string;
}

const REGHORAS = gql`
mutation Mutation($tiempo: Float, $trabajoRealizado: String, $fdesde: String, $comentario: String) {
    setTrabajoReg(tiempo: $tiempo, trabajoRealizado: $trabajoRealizado, Fdesde: $fdesde, comentario: $comentario) {
      _id
    }
  }
`

const EDIT_REGHORAS = gql`
mutation Mutation($editTrabajoRegId: String, $tiempo: Float, $trabajoRealizado: String, $fdesde: String, $comentario: String) {
    editTrabajoReg(_id: $editTrabajoRegId, tiempo: $tiempo, trabajoRealizado: $trabajoRealizado, Fdesde: $fdesde, comentario: $comentario) {
      _id
    }
  }   
`

const DELETE_REGHORAS = gql`
mutation Mutation($deleteTrabajoRegId: String) {
    deleteTrabajoReg(_id: $deleteTrabajoRegId) {
      _id
    }
  }
`

const GETREGHORAS = gql`
query Query {
    getTrabajoReg {
      tiempo
      trabajoRealizado
      Fdesde
      comentario
      _id
    }
  }
`

const RegHoras: FC<{
    reloadHandler: () => void;
    horasSemanales: number;
}> = ({ reloadHandler, horasSemanales }) => {

    const [tiempo, setTiempo] = useState<number>(0);
    const [orden, setOrden] = useState<string>("1");
    const [trabajoRealizado, setTrabajoRealizado] = useState<string>("");
    const [fdesde, setFdesde] = useState<string>("");
    const [comentario, setComentario] = useState<string>("");
    const [id, setId] = useState<string>("");

    const [pantalla, setPantalla] = useState<number>(0);

    const [regHoras] = useMutation(REGHORAS);
    const [editRegHoras] = useMutation(EDIT_REGHORAS);
    const [delteRegHoras] = useMutation(DELETE_REGHORAS);

    const { data, loading, error } = useQuery<{ getTrabajoReg: TrabajoReg[] }>(
        GETREGHORAS,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    let a = 0;
    let registros = data?.getTrabajoReg.map((e) => {
        a = a + e.tiempo;
        return {
            _id: e._id,
            comentario: e.comentario,
            Fdesde: e.Fdesde,
            tiempo: e.tiempo,
            trabajoRealizado: e.trabajoRealizado,
        }
    })

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;

    return (
        <div className="flex h-screen flex-1 flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <button className="text-lg border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(1)
                    }}>Registrar trabajo</button>
                    {horasSemanales && <div className="p-4 font-serif text-lg ">HORAS RESTANTES: {horasSemanales / 5 - a}</div>}

                    <div className="m-2 text-lg">
                        Ordernar<br />
                        <select
                            className="mr-2 bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                            value={"ORDENAR"}
                            onChange={(e) => setOrden(e.target.value)}
                        >
                            <option value={"1"}>Menor hora inicio</option>
                            <option value={"2"}>Mayor hora inicio</option>
                        </select>
                    </div>
                    {orden === "1" &&
                        <div>
                            {registros?.sort((o1, o2) => {
                                if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) < parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return -1;
                                else if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) > parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return 1;
                                else return 0;
                            }).map((e) => (
                                <div className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                    <div className="font-bold">Tiempo</div> {e.tiempo} h
                                    <div className="font-bold">Trabajo Realizado</div> {e.trabajoRealizado}
                                    <div className="font-bold">Hora de comienzo</div> {e.Fdesde} h
                                    <div className="font-bold">Comentario</div>
                                    <div className="p-2">{e.comentario}</div>
                                    <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                        setTiempo(e.tiempo);
                                        setTrabajoRealizado(e.trabajoRealizado);
                                        setFdesde(e.Fdesde);
                                        setComentario(e.comentario);
                                        setId(e._id);
                                        setPantalla(2);
                                    }}>
                                        <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                                    </button>
                                    <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                        delteRegHoras({
                                            variables: {
                                                deleteTrabajoRegId: e._id,
                                            },
                                            context: {
                                                headers: {
                                                    authorization: localStorage.getItem("token")
                                                }
                                            }
                                        }).then(() => {
                                            reloadHandler();
                                        });
                                    }}><svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg></button>
                                </div>
                            ))}
                        </div>
                    }
                    {orden === "2" &&
                        <div>
                            {registros?.sort((o1, o2) => {
                                if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) < parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return -1;
                                else if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) > parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return 1;
                                else return 0;
                            }).reverse().map((e) => (
                                <div className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                    <div className="font-bold">Tiempo</div> {e.tiempo} h
                                    <div className="font-bold">Trabajo Realizado</div> {e.trabajoRealizado}
                                    <div className="font-bold">Hora de comienzo</div> {e.Fdesde} h
                                    <div className="font-bold">Comentario</div>
                                    <div className="p-2">{e.comentario}</div>
                                    <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                        setTiempo(e.tiempo);
                                        setTrabajoRealizado(e.trabajoRealizado);
                                        setFdesde(e.Fdesde);
                                        setComentario(e.comentario);
                                        setId(e._id);
                                        setPantalla(2);
                                    }}>
                                        <svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                                    </button>
                                    <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                        delteRegHoras({
                                            variables: {
                                                deleteTrabajoRegId: e._id,
                                            },
                                            context: {
                                                headers: {
                                                    authorization: localStorage.getItem("token")
                                                }
                                            }
                                        }).then(() => {
                                            reloadHandler();
                                        });
                                    }}><svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg></button>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
            {pantalla === 1 &&
                <div>
                    <button className=" text-lg border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>&lt;</button>
                    <div className="flex justify-start p-4 text-xl underline underline-offset-1 font-serif">Añade el trabajo realizado</div>
                    <div className="block mx-4 text-lg">
                        <span className="after:content-['*'] after:ml-0.5  after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Tiempo dedicado (en horas)
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            step="0.1"
                            type="number"
                            value={tiempo}
                            onChange={(e) => setTiempo(e.target.valueAsNumber)}
                            min="0"
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Tarea realizada
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="text"
                            value={trabajoRealizado}
                            onChange={(e) => setTrabajoRealizado(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Hora de inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="time"
                            value={fdesde}
                            onChange={(e) => setFdesde(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:ml-0.5 block text-lg font-medium text-slate-700 mt-5">
                            Comentario
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="text"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        ></input>
                    </div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        if (tiempo === 0) window.alert("Es obligatorio poner el tiempo dedicado a tus tareas.")
                        else if (trabajoRealizado === "") window.alert("Es obligatorio poner la tarea realizada.")
                        else if (trabajoRealizado.length > 30) window.alert("El limite de caracteres del campo Trabajo Realizado es 30.")
                        else if (fdesde === "") window.alert("Es obligatorio poner la hora de comienzo.")
                        else if (comentario.length > 50) window.alert("El limite de caracteres del campo Comentario es 50.")
                        else {
                            regHoras({
                                variables: {
                                    tiempo,
                                    trabajoRealizado,
                                    fdesde,
                                    comentario
                                },
                                context: {
                                    headers: {
                                        authorization: localStorage.getItem("token")
                                    }
                                }
                            }).then(() => {
                                setTiempo(0);
                                setTrabajoRealizado("");
                                setFdesde("");
                                setComentario("");
                                setPantalla(0);
                                reloadHandler();
                            });
                        }
                    }}>Aceptar</button>
                </div>
            }
            {pantalla === 2 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>&lt;</button>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Tiempo dedicado
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            step="0.1"
                            type="number"
                            value={tiempo}
                            onChange={(e) => setTiempo(e.target.valueAsNumber)}
                            min="0"
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Tarea realizada
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="text"
                            value={trabajoRealizado}
                            onChange={(e) => setTrabajoRealizado(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Hora de inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="time"
                            value={fdesde}
                            onChange={(e) => setFdesde(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg font-medium text-slate-700 mt-5">
                            Comentario
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg focus:ring-1"
                            type="text"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        ></input>
                    </div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {

                        if (tiempo === 0) window.alert("Es obligatorio poner el tiempo dedicado a tus tareas.")
                        else if (trabajoRealizado === "") window.alert("Es obligatorio poner la tarea realizada.")
                        else if (trabajoRealizado.length > 30) window.alert("El limite de caracteres para ese campo es de 30.")
                        else if (fdesde === "") window.alert("Es obligatorio poner la hora de comienzo.")
                        else if (comentario.length > 50) window.alert("El limite de caracteres para ese campo es de 50.")
                        else {
                            editRegHoras({
                                variables: {
                                    editTrabajoRegId: id,
                                    trabajoRealizado,
                                    fdesde,
                                    comentario,
                                    tiempo
                                },
                                context: {
                                    headers: {
                                        authorization: localStorage.getItem("token")
                                    }
                                }
                            }).then(() => {
                                setTiempo(0);
                                setTrabajoRealizado("");
                                setFdesde("");
                                setComentario("");
                                setPantalla(0);
                                reloadHandler();
                            });
                        }
                    }}>Aceptar</button>
                </div>
            }
        </div>
    )
}

export default RegHoras;
