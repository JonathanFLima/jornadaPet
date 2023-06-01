import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  petInfos: {
    backgroundColor: '#FFF',
    padding: 10,
    borderColor: '#DDDBDA',
    borderWidth: 1,
    borderRadius: 5,
  },

  dateInput: {
    fontSize: 13,
    height: 40,
    backgroundColor: '#FFF',

  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start'
  },


  vaccineInfo: {
    backgroundColor: '#FFF',
    width: '95%',
    alignSelf: 'center',
    padding: 8,
    borderColor: '#DDDBDA',
    borderWidth: 1,
    borderRadius: 5,

    marginTop: 5
  },

  vaccinesView: {

    flex: 0.9,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDDBDA',
    padding: 2,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderTopStartRadius: 0,
    borderTopEndRadius: 0



  },

  petInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  deletePetButton: {
    marginTop: 10,


  }
});

export default styles;