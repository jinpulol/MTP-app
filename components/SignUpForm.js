import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignUpForm({ onRegistrationSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (onRegistrationSuccess) {
                    onRegistrationSuccess(user);
                }
                Alert.alert('Onnistui', 'Rekisteröinti onnistui!');
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
                Alert.alert('Virhe', errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Sähköposti"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Salasana"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <Button title="Rekisteröidy" onPress={handleSignUp} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
});
