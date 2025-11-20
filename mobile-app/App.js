import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function App(){
  return (
    <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:18}}>Habit Hero — Mobile scaffold</Text>
      <Text style={{marginTop:10}}>Expo + Notifications placeholders</Text>
    </SafeAreaView>
  );
}
