import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Fichaje from "./Fichaje"
import RegHoras from "./RegHoras"
import LogIn from "./LogIn";
import CrearUsuarios from "./CrearUsuarios";
import Vacas from "./Vacas";

const GETUSER = gql`
query Query {
  getUser {
    diasHabiles
    horasSemanales
    _id
    nombre
    permisos
  }
}
`

const LOGOUT = gql`
mutation Mutation{
    logOut{
        _id
    }
  }
`

type Usuario = {
  diasHabiles: number;
  horasSemanales: number;
  _id: string;
  nombre: string;
  permisos: string;
}

const Contenedor: FC<{
  reloadHandler: () => void;
}> = ({ reloadHandler }) => {
  const token = localStorage.getItem("token");
  const [pantallas, setPantallas] = useState<number>(0);
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const f = new Date();

  const fecha = diasSemana[f.getDay()] + " " + f.getDate() + " de " + meses[f.getMonth()] + " del " + f.getFullYear();

  
  const { data } = useQuery<{ getUser: Usuario }>(
    GETUSER,
    {
      context: {
        headers: {
          authorization: token
        }
      },
    }
  );

  const [logout, { loading, error }] = useMutation(LOGOUT, {
    onCompleted: () => {
      localStorage.removeItem("token");
      reloadHandler();
    },
    onError: (error) => {
      console.log(error);
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error :(</div>;

  return (
      <div className="h-screen ">
        {token ? (
          <div>
            <div className="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[180px] md:flex-col">
              <div className="flex h-full min-h-0 flex-col ">
                <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                  <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                    <button onClick={() => setPantallas(0)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                      <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm2-2.25a8 8 0 100-16 8 8 0 000 16zm-4-5.75a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4zm6 0a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4z" />
                      </svg>Inicio
                    </button>
                    <button onClick={() => setPantallas(1)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                      <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm2-2.25a8 8 0 100-16 8 8 0 000 16zm-4-5.75a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4zm6 0a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4z" />
                      </svg>Vacaciones
                    </button>
                    <button onClick={() => setPantallas(2)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                      <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm2-2.25a8 8 0 100-16 8 8 0 000 16zm-4-5.75a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4zm6 0a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4z" />
                      </svg>Fichaje
                    </button>
                    <button onClick={() => setPantallas(3)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                      <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                        <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm2-2.25a8 8 0 100-16 8 8 0 000 16zm-4-5.75a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4zm6 0a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4z" />
                      </svg>Registro de horas
                    </button>
                    {data?.getUser.permisos === "Administrador" &&
                      <button onClick={() => setPantallas(4)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                        <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4">
                          <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm2-2.25a8 8 0 100-16 8 8 0 000 16zm-4-5.75a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4zm6 0a1 1 0 011-1 1 1 0 011 1v4a1 1 0 01-2 0v-4z" />
                        </svg>Crear un Usuario
                      </button>
                    }
                    <div className="flex-1"></div>
                    <button onClick={() => {
                      logout({
                        context: {
                          headers: {
                            authorization: localStorage.getItem("token")
                          }
                        }
                      });
                    }} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                      <svg stroke="currentColor" viewBox="0 0 24 24" className="h-4 w-4" >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>Cerrar sesion
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex justify-center p-3 underline underline-offset-1 font-serif">{fecha}</div>
            {pantallas === 0 &&
              <div className="flex h-full flex-1 flex-col md:pl-[190px] p-4 mb-56">
                Bienvenido {data?.getUser.nombre} a GestApp, donde podras gestionar tus entradas y salidas, tus vacaciones y el trabajo que realizas durante tu jornada laboral. ¡Explora nuestro sitio y descubre todo lo que tenemos para ofrecerte!<br></br>
                <br></br>
              </div>
            }
            {pantallas === 1 &&
              <Vacas diasHabiles={data?.getUser.diasHabiles} reloadHandler={reloadHandler} permisos={data?.getUser.permisos}></Vacas>
            }
            {pantallas === 2 &&
              <Fichaje horasSemanales={data?.getUser.horasSemanales} reloadHandler={reloadHandler}></Fichaje>
            }
            {pantallas === 3 &&
              <RegHoras horasSemanales={data?.getUser.horasSemanales} reloadHandler={reloadHandler}></RegHoras>
            }
            {pantallas === 4 &&
              <CrearUsuarios reloadHandler={reloadHandler}></CrearUsuarios>
            }
            {pantallas === 0 &&
              <footer className="footer flex flex-row p-10 bg-neutral text-neutral-content bottom-0 md:pl-[190px]">
                <div>
                  <span className="footer-title">Services</span>
                  <button className="link link-hover">Branding</button>
                  <button className="link link-hover">Design</button>
                  <button className="link link-hover">Marketing</button>
                  <button className="link link-hover">Advertisement</button>
                </div>
                <div>
                  <span className="footer-title">Company</span>
                  <button className="link link-hover">About us</button>
                  <button className="link link-hover">Contact</button>
                  <button className="link link-hover">Jobs</button>
                  <button className="link link-hover">Press kit</button>
                </div>
                <div>
                  <span className="footer-title">Legal</span>
                  <button className="link link-hover">Terms of use</button>
                  <button className="link link-hover">Privacy policy</button>
                  <button className="link link-hover">Cookie policy</button>
                </div>
              </footer>
            }
          </div>
        ) : (
          <LogIn reloadHandler={reloadHandler}></LogIn>
        )}
      </div>
  );
}

export default Contenedor;
