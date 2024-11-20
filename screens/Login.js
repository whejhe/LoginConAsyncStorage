import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const loginSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
});

const Login = () => {
    const navigation = useNavigation();
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                if (parsedData.email === values.email && parsedData.password === values.password) {
                    // Login exitoso, redirige a Home
                    navigation.navigate('Home');
                } else {
                    setError('Credenciales incorrectas');
                }
            } else {
                setError('No hay usuarios registrados');
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                        />
                        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                        />
                        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                        <Pressable style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Iniciar sesión</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: 300,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        width: 300,
        height: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default Login;