import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

export default function SearchEvents() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Kaikki');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const searchEvents = () => {
        const database = getDatabase();
        const eventsRef = ref(database, 'events');
        let queryRef = eventsRef;

        // Lisää hakuehto kategorialle
        if (selectedCategory !== 'Kaikki') {
            queryRef = query(queryRef, orderByChild('category'), equalTo(selectedCategory));
        }

        // Lisää hakuehto päivämäärälle
        if (selectedDate) {
            // Muunna valittu päivämäärä oikeaan muotoon (voit tarvita erilaista muotoilua riippuen siitä, miten se on tallennettu tietokantaan)
            const formattedDate = selectedDate.toISOString().split('T')[0];
            queryRef = query(queryRef, orderByChild('datetime'), equalTo(formattedDate));
        }

        onValue(queryRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const eventsArray = Object.values(data);
                setSearchResults(eventsArray);
            } else {
                setSearchResults([]);
            }
        });
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios'); // Näytä datepicker vain iOS:llä
        setSelectedDate(selectedDate || selectedDate); // Jos käyttäjä peruuttaa valinnan, säilytä nykyinen valinta
    };

    const renderItem = ({ item }) => (
        <View>
            <Text>Tapahtuman nimi: {item.name}</Text>
            <Text>Tapahtuman kategoria: {item.category}</Text>
            <Text>Tapahtuman paikka: {item.location}</Text>
            <Text>Tapahtuman päivämäärä ja aika: {item.datetime}</Text>
        </View>
    );

    return (
        <View>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Hakusana"
                    onChangeText={setSearchTerm}
                    value={searchTerm}
                />
                <Picker
                    selectedValue={selectedCategory}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
                >
                    <Picker.Item label="Kaikki" value="Kaikki" />
                    <Picker.Item label="Kategoria 1" value="Kategoria 1" />
                    <Picker.Item label="Kategoria 2" value="Kategoria 2" />
                    <Picker.Item label="Kategoria 3" value="Kategoria 3" />
                </Picker>
            </View>
            <View style={styles.row}>
                <Button title="Hae tapahtumia" onPress={searchEvents} />
                <Button title="Valitse päivämäärä" onPress={showDatePickerModal} />
            </View>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        flex: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
});