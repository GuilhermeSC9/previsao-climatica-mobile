import { View, Text, Image } from "react-native";
import { styles } from './HeaderStyles';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Etec Weather</Text>
      <Image style={styles.logo} source={require('../../../assets/logo.png')}></Image>
    </View>
  );
}
