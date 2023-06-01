import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',

    backgroundColor: '#FFF'


  },

  addButton: {
    position: 'absolute',
    backgroundColor: '#6200ED',
    width: 75,
    height: 75,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 50,
    right: 35,
    bottom: 30
  },

  avatar: {
    borderWidth: 2,
    borderColor: 'orange'
  },

  addNewPetText: {
    color: '#FFF',
    fontSize: 45,
    fontWeight: 'bold'
  },

  petProfiles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'baseline',
    alignContent: 'flex-start',
    alignSelf: 'center',



  },

  petInfo: {
    alignItems: 'center',
    padding: 10
  },

  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 10,
    color: '#231f20'
  }

});

export default styles;