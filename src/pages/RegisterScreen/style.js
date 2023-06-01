import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#FF8718',
    width: '100%',
    height: '100%',
    padding: 10
  },

  pad: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    width: '100%',
    height: '50%',
    flex: 2,

    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {

    width: '40%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 50,

  },

  inputName: {
    width: 291,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,


    marginTop: 10,
    paddingLeft: 10
  },

  inputEmail: {
    width: 291,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,


    marginTop: 10,
    paddingLeft: 10
  },

  inputPassword: {
    width: 291,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,

    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10
  },

  registerButton: {
    marginBottom: 15
  },

  registerLink: {
    color: '#1877F2',
  }

});

export default styles;