import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

import { firebase, auth, database } from '../services/firebase';

type User = {
  id: string,
  name: string,
  avatar: string,
}

type AuthContextProviderType = {
  user: User | undefined,
  signInWIthGoogle: () => Promise<void>,
  isFetching: boolean,
  setIsFetching: Dispatch<SetStateAction<boolean>>,
}

type AuthProviderProps = {
  children: ReactNode,
}

export const MyContext = createContext({} as AuthContextProviderType);

export function AuthContextProvider(props : AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => { //verifica se o usuário ja tinha feito os login, se sim, recupera os seus dados
  //     if (user) {
  //       const { displayName: name, photoURL: avatar, uid: id } = user;
  //       if (!name || !avatar) {
  //         throw new Error('Missing information from Google Account.');
  //       }
  //       setUser({ id, name, avatar });
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  const signInWIthGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider(); //cria uma instância para fazer a autenticação com conta google

    const result = await auth.signInWithPopup(provider) // abre um popup para fazer a verificação com a instância que foi criada

    if (result.user) {
      const { displayName: name, photoURL: avatar, uid: id } = result.user;
      if (!name || !avatar) {
        throw new Error('Missing information from Google Account.');
      }
      setUser({ id, name, avatar });
    }
  };

  return (
    <MyContext.Provider value={{ user, signInWIthGoogle, isFetching, setIsFetching }}>
      {props.children}
    </MyContext.Provider>
  );

};