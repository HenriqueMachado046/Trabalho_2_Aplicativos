import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TextInput, Button } from 'react-native-paper';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = () => {
        login(email, password).then(() => {
            navigation.navigate('Home');
        }).catch((error) => {
            console.error('Erro ao logar:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text>Login</Text>
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
                mode="flat"
                value={password}
                onChangeText={setPassword}
            />
            <Button mode="contained" onPress={handleLogin} >Login</Button>
            <Button mode="contained" onPress={() => navigation.navigate('Register')}>Registrar</Button>
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

export default Login;
