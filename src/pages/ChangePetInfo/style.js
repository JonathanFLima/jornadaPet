import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  label: {
    fontSize: 34,
    fontWeight: 'bold'
  },

  input: {
    fontSize: 13,
    height: 40,
    backgroundColor: '#FFF',


  },

  error: {
    borderColor: 'red',
    fontSize: 13,
    height: 40,
    backgroundColor: '#FFF',
  },

  dateInput: {
    fontSize: 13,
    height: 40,
    backgroundColor: '#FFF',
    width: 190
  },



  ageAndWeightView: {
    flexDirection: 'row',
    justifyContent: 'space-between'


  },

  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',

  },

  catOrDog: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  birthInput: {
    flexDirection: 'row'
  },

  petSelect: {
    padding: 8,
    backgroundColor: '#FFF',
    borderColor: '#DDDBDA',
    borderWidth: 1,
    borderRadius: 5
  },

  petPhoto: {
    marginTop: 3,
    padding: 8,
    backgroundColor: '#FFF',
    borderColor: '#DDDBDA',
    borderWidth: 1,
    borderRadius: 5

  },

  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
    
  },

});

export default styles;