import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Fichaje from "./Fichaje"
import RegHoras from "./RegHoras"
import LogIn from "./LogIn";
import CrearUsuarios from "./GestionAdmin/CrearUsuarios";
import Vacas from "./Vacas";
import PerfilUsuario from "./PerfilUsuario";
import GeneradorInformes from "./GeneradorInformes";

const GETUSER = gql`
query Query {
  getUser {
    correo
    _id
    apellido1
    apellido2
    contrasena
    diasHabiles
    direccion
    dni
    horasSemanales
    nombre
    permisos
    telefono
    token
    turno
    cargo
  }
}
`

const LOGOUT = gql`
mutation{
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
  correo: string;
  telefono: string;
  apellido1: string;
  apellido2: string;
  turno: string;
  dni: string;
  direccion: string;
  cargo: string;
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
    <div className="h-screen">
      {token ? (
        <div>
          <div className="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[180px] md:flex-col">
            <div className="flex h-full min-h-0 flex-col ">
              <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
                <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                  <button onClick={() => setPantallas(0)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                    </svg>Inicio
                  </button>
                  <button onClick={() => setPantallas(5)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>Perfil
                  </button>
                  <button onClick={() => setPantallas(2)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                    </svg>Fichaje
                  </button>
                  <button onClick={() => setPantallas(3)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                    </svg>Registro de horas
                  </button>
                  <button onClick={() => setPantallas(4)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                    </svg>Documentos
                  </button>
                  <button onClick={() => setPantallas(1)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                      <style>{`svg{fill:#ffffff}`}</style>
                      <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z" />
                    </svg>Calendario
                  </button>
                  {data?.getUser.permisos === "Administrador" &&
                      <button onClick={() => setPantallas(6)} className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                          <style>{`svg{fill:#ffffff}`}</style>
                          <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                        </svg>Alta Usuarios
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
          {pantallas === 0 &&
            <div>
              <div className="flex h-full flex-1 flex-col md:pl-[190px] p-4 mb-56 mx-32">
                <div className="flex justify-center p-8 underline underline-offset-1 font-serif">{fecha}</div>
                Bienvenido {data?.getUser.nombre} a GestApp, donde podras gestionar tus entradas y salidas, tus vacaciones y el trabajo que realizas durante tu jornada laboral. ¡Explora nuestro sitio y descubre todo lo que tenemos para ofrecerte!<br></br>
                <br></br>
              </div>
              <div className="md:pt-[400px]">
              <footer className="footer flex flex-row p-10 bg-neutral text-neutral-content md:pl-[190px]">
                <div className="mx-20">
                  <span className="footer-title">Company</span>
                  <button className="link link-hover">About us</button>
                  <button className="link link-hover">Contact</button>
                  <button className="link link-hover">Jobs</button>
                </div>
                <div className="mx-20">
                  <span className="footer-title">Legal</span>
                  <button className="link link-hover">Terms of use</button>
                  <button className="link link-hover">Privacy policy</button>
                  <button className="link link-hover">Cookie policy</button>
                </div>
              </footer>
              </div>
            </div>
          }
          {pantallas === 1 && data &&
            <Vacas diasHabiles={data.getUser.diasHabiles} reloadHandler={reloadHandler} permisos={data?.getUser.permisos}></Vacas>
          }
          {pantallas === 2 && data &&
            <div>
              <div className="flex justify-center p-8 underline underline-offset-1 font-serif">{fecha}</div>
              <Fichaje horasSemanales={data?.getUser.horasSemanales} reloadHandler={reloadHandler}></Fichaje>
            </div>
          }
          {pantallas === 3 && data &&
            <div>
              <div className="flex justify-center p-8 underline underline-offset-1 font-serif">{fecha}</div>
              <RegHoras horasSemanales={data?.getUser.horasSemanales} reloadHandler={reloadHandler}></RegHoras>
            </div>
          }
          {pantallas === 4 &&
            <GeneradorInformes reloadHandler={reloadHandler}></GeneradorInformes>
          }
          {pantallas === 5 && data &&
            <PerfilUsuario data={data.getUser} reloadHandler={reloadHandler}></PerfilUsuario>
          }
          {pantallas === 6 &&
            <CrearUsuarios reloadHandler={reloadHandler}></CrearUsuarios>
          }
        </div>
      ) : (
        <LogIn reloadHandler={reloadHandler}></LogIn>
      )}
    </div>
  );
}

export default Contenedor;
