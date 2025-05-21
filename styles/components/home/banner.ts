import { StyleSheet } from 'react-native';

export const bannerStyles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
    height: 130,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    width: '90%',
    zIndex: 5,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 1,
  },
  textContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
}); 