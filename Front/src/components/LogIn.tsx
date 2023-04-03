import React, { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

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
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <p className="py-6">Bienvenido a GestApp tu gestor de confianza. Disfruta de nuestros servicios.</p>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            {error &&
                                <div className=" text-red-500">Usuario no registrado</div>
                            }
                            {loading &&
                                <div className=" text-red-500">Cargando...</div>
                            }
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text" placeholder="email" className="input input-bordered" onChange={(e) => setCorreo(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" placeholder="contrasena" className="input input-bordered" onChange={(e) => setContrasena(e.target.value)} />
                                <label className="label">
                                    <a className="label-text-alt link link-hover">Has olvidado la contraseña?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <label htmlFor="log" className="btn btn-primary" onClick={() => {
                                    console.log("HOA")
                                    login({
                                        variables: {
                                            correo,
                                            contrasena
                                        },
                                    });
                                }}>Login</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogIn;