import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, push, ref } from 'firebase/database';

const database = getDatabase();

export default function CreateEvent({ user }) {
    const [eventName, setEventName] = useState('');
    const [category, setCategory] = useState('Kategoria 1');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [eventLocation, setEventLocation] = useState('');

    const handleCreateEvent = () => {
        const newEvent = {
            name: eventName,
            category: category,
            datetime: date.toLocaleString(),
            location: eventLocation,
            // creatorId: user.uid, ajatuksena saada lisättyä käyttäjän uid creatorId:ksi.
            // Tällöin creatorId:tä voisi mahdollisesti käyttää tapahtuman poistamiseen,
            // jos kirjautunut user = creatorId
        };

        push(ref(database, 'events/'), newEvent)
            .then(() => {
                alert('Tapahtuma tallennettu onnistuneesti!');
            })
            .catch(error => {
                console.error('Virhe tallennettaessa tapahtumaa Firebaseen:', error);
                alert('Tapahtuman tallentaminen epäonnistui. Ole hyvä ja yritä uudelleen.');
            });

        setEventName('');
        setCategory('Kategoria 1');
        setDate(new Date());
        setEventLocation('');
    };

    const handleDateChange = (_, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (_, selectedDate) => {
        setShowTimePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={eventName}
                onChangeText={text => setEventName(text)}
                placeholder="Tapahtuman nimi"
            />
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Kategoria 1" value="Kategoria 1" />
                <Picker.Item label="Kategoria 2" value="Kategoria 2" />
                <Picker.Item label="Kategoria 3" value="Kategoria 3" />
            </Picker>
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>Päivämäärä: {date.toDateString()}</Text>
                <Button title="Valitse päivämäärä" onPress={() => setShowDatePicker(true)} />
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>Aika: {date.toLocaleTimeString()}</Text>
                <Button title="Valitse aika" onPress={() => setShowTimePicker(true)} />
            </View>
            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Tapahtumapaikka"
                value={eventLocation}
                onChangeText={setEventLocation}
            />
            <Button title="Luo tapahtuma" onPress={handleCreateEvent} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    picker: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateTimeText: {
        flex: 1,
    },
});