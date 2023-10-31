import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Modal, View, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';


import { validatePracticePlan, addPracticeData } from '../helpers';
import { bottomStyles, inputStyles } from '../assets/styles/auth_and_profile_styles';


interface AddPlanDetailsProp {
    uid: string;
    date: Date;
    view: boolean;
    setView: (selected: boolean) => void;
}


const AddPlanDeatails: React.FC<AddPlanDetailsProp> = ({ uid, date, view, setView }) =>
{
    const [title, setTitle] = useState<string>('');
    const [piece, setPiece] = useState<string>('');
    const [composer, setComposer] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    async function handleSave() {
        const detailsError = validatePracticePlan(title, piece, composer);
        if (detailsError) {
            Alert.alert('Invalid Details', detailsError, [ {text: 'OK'} ]);
        }
        else {
            try {
                await addPracticeData(uid, title, piece, composer, date, notes);
                setView(false);
            }
            catch (e) {
                Alert.alert('Practice Plan Addition Failed', 'Unable to add plan. Please try again later.', [{ text: 'OK' }]);
            }
        }
    }

    return (
        <Modal animationType="fade" transparent={true} visible={view}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <SafeAreaView style={{ flex: 0.70, width: '90%', backgroundColor: '#ECF1F7', borderRadius: 10 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ width: '95%', padding: '5%', alignSelf: 'center', backgroundColor: '#ECF1F7' }}>
                            <View style={{ width: '95%', marginBottom: '5%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => setView(false)} style={{ alignItems: 'flex-end', marginTop: 10 }}>
                                    <Ionicons name="close" size={40} color='black'/>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', left: '-95%', alignItems: 'center', }}>Plan Details</Text>
                            </View>
                            <View>
                                <Text style={inputStyles.profileLabelText}>Title</Text>
                                <TextInput
                                    style={inputStyles.profileInputBox}
                                    placeholder={'Enter practice title'}
                                    placeholderTextColor='#CCCCCC'
                                    onChangeText={(text) => setTitle(text)}
                                    value={title}
                                />
                                <Text style={inputStyles.profileLabelText}>Piece</Text>
                                <TextInput
                                    style={inputStyles.profileInputBox}
                                    placeholder={'Enter piece name'}
                                    placeholderTextColor='#CCCCCC'
                                    onChangeText={(text) => setPiece(text)}
                                    value={piece}
                                />
                                <Text style={inputStyles.profileLabelText}>Composer</Text>
                                <TextInput
                                    style={inputStyles.profileInputBox}
                                    placeholder={'Enter composer name'}
                                    placeholderTextColor='#CCCCCC'
                                    onChangeText={(text) => setComposer(text)}
                                    value={composer}
                                />
                                <Text style={inputStyles.profileLabelText}>Practice Date</Text>
                                <TextInput
                                    style={inputStyles.profileInputBox}
                                    value={date.toDateString()}
                                    editable={false}
                                />
                                <Text style={inputStyles.profileLabelText}>Notes</Text>
                                <TextInput
                                    style={inputStyles.profileInputBox}
                                    placeholder={'Enter any notes'}
                                    placeholderTextColor='#CCCCCC'
                                    onChangeText={(text) => setNotes(text)}
                                    value={notes}
                                />
                            </View>
                            <View style={{ width: '70%', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={handleSave} style={bottomStyles.redButton}>
                                    <Text style={bottomStyles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default AddPlanDeatails;
