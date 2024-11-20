import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
});

const Register = () => {
    const navigation = useNavigation();
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                await AsyncStorage.setItem('userData', JSON.stringify(values));
                // Registro exitoso, redirige a Login
                navigation.navigate('Login');
            } else {
                setError('Ya hay un usuario registrado');
            }
        } catch (error) {
            setError('Error al registrar');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={registerSchema}
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
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar password"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                        />
                        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                        <Pressable style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Registrar</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                ¿Ya tienes una cuenta? Iniciar sesión
            </Text>
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
        color: '#fff',
        fontSize: 16,
    }
});

export default Register;