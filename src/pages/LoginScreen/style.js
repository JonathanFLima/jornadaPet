import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {

    backgroundColor: '#FF8718',
    
    padding: 10,
    flex: 1
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
    marginBottom: 50,

  },

  inputEmail: {
    width: 291,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,

    bottom: 5,
    marginTop: 10,
    paddingLeft: 5
  },

  inputPassword: {
    width: 291,
    height: 45,

    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,


    marginBottom: 20,
    paddingLeft: 5
  },

  loginButton: {
    marginBottom: 15
  },

  loginLink: {
    color: '#1877F2',
  },

});

export default styles;