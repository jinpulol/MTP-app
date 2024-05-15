import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                onLoginSuccess();
            })
            .catch((error) => {
                const errorMessage = error.message;
                Alert.alert('Error', errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Sähköposti"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Salasana"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Kirjaudu sisään" onPress={handleSignIn} />
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
});
