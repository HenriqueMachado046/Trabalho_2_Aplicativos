import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(null); // Adicionado para armazenar o token

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setUserToken(parsedUser.token); // Armazenar o token ao carregar o usuário
            }
        };
        loadUserData();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth', 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const userData = response.data;
            setUser(userData);
            setUserToken(userData.token); // Armazenar o token ao fazer login
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const register = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/users', 
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const userData = response.data;
            setUser(userData);
            setUserToken(userData.token); // Armazenar o token ao se registrar
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const logout = async () => {
        setUser(null);
        setUserToken(null); // Limpar o token ao deslogar
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, userToken, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};