import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

export default function EventList({ user }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const database = getDatabase();
        const eventsRef = ref(database, 'events');

        onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const eventsArray = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
                setEvents(eventsArray);
            }
        });

        return () => {

        };
    }, []);

    const handleDeleteEvent = (eventId) => {
        const database = getDatabase();
        const eventRef = ref(database, `events/${eventId}`);
        remove(eventRef);
    };

    const renderItem = ({ item }) => (
        <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>Tapahtuman nimi: {item.name}</Text>
            <Text style={styles.eventInfo}>Tapahtuman paikka: {item.location}</Text>
            <Text style={styles.eventInfo}>Tapahtuman päivämäärä ja aika: {item.datetime}</Text>
            {user && user.uid === item.creatorId && (
                <Button title="Poista" onPress={() => handleDeleteEvent(item.id)} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatlistContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    flatlistContainer: {
        paddingBottom: 20,
    },
    eventContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    eventTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    eventInfo: {
        fontSize: 14,
        marginBottom: 3,
    },
});