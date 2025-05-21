import { StyleSheet } from 'react-native';

export const addressBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 45,
    borderRadius: 8,
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 