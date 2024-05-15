import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default function Settings({ onLogout }) {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Kirjaudu ulos" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});