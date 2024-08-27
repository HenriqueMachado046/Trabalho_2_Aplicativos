import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TextInput, Button } from 'react-native-paper';

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);

    const handleRegister = () => {
        register(email, password).then(() => {
            alert("Usuário criado com sucesso! Por favor, realize o login antes de continuar.")
            navigation.navigate('Login');
        }).catch((error) => {
            console.error('Erro ao registrar:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                mode="flat"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                mode="flat"
                onChangeText={setPassword}
            />
            <Button mode="contained" onPress={handleRegister}>Registrar</Button>
            <Button mode="contained" onPress={() => navigation.navigate('Login')} >Login</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default Register;
