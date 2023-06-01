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
    flexWrap: 'nowrap',

  },

  dateInput: {
    fontSize: 13,
    width: '83%',
    backgroundColor: '#FFF',

  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start'
  },



  input: {
    fontSize: 13,
    height: 40,
    backgroundColor: '#FFF',


  },

  containerInfo: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    borderColor: '#DDDBDA',
    borderWidth: 1,
  },


  vaccineInfo: {
    backgroundColor: '#FFF',
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    borderColor: '#DDDBDA',
    borderWidth: 1,
    borderRadius: 5,

    marginBottom: 10
  },

  vaccinesView: {

    flex: 0.5

  },

  petInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default styles;