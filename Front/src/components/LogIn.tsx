import { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import RecuperarPWD from "./RecuperarPWD";

const LOGIN = gql`
mutation LogIn($correo: String!, $contrasena: String!) {
    logIn(correo: $correo, contrasena: $contrasena) {
      token
    }
  }
`

const LogIn: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {

    const [correo, setCorreo] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");
    const [pantallaRecuperarPWS, setPantallaRecuperarPWS] = useState<boolean>(false);

    const [login, { loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            console.log(`guardo cookie con token ${data.logIn.token}`)
            localStorage.setItem("token", data.logIn.token);
            reloadHandler();
        },
        onError: (error) => {
            console.log(error);
            localStorage.removeItem("token");
        }
    });

    return (
        <div>
            <div className="hero min-h-screen bg-base-200 bg-[url('./Fondo.jpg')] bg-cover bg-no-repeat">
                {pantallaRecuperarPWS === false &&
                    <div className="hero-content flex-col">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Iniciar Sesión!</h1>
                            <p className="py-6">Bienvenido a GestApp. Disfruta de nuestros servicios.</p>
                        </div>
                        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <div className="card-body">
                                {error &&
                                    <div className=" text-red-500">Usuario no registrado</div>
                                }
                                {loading &&
                                    <div className=" text-500">Cargando...</div>
                                }
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="text" placeholder="email" className="input input-bordered" onChange={(e) => setCorreo(e.target.value)} />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Contraseña</span>
                                    </label>
                                    <input type="password" placeholder="contrasena" className="input input-bordered" onChange={(e) => setContrasena(e.target.value)} />
                                    <label>
                                        <button className="label-text-alt link link-hover" onClick={() => {
                                            setPantallaRecuperarPWS(true);
                                            setCorreo("");
                                        }}>Has olvidado la contraseña?</button>
                                    </label>
                                </div>
                                <div className="form-control mt-6">
                                    <label htmlFor="log" className="btn btn-primary" onClick={() => {
                                        login({
                                            variables: {
                                                correo,
                                                contrasena
                                            },
                                        });
                                    }}>Iniciar Sesion</label>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {pantallaRecuperarPWS === true &&
                    <RecuperarPWD setPantallaRecuperarPWS={setPantallaRecuperarPWS}></RecuperarPWD>
                }
            </div>
        </div>
    )
}

export default LogIn;