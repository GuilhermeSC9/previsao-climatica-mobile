import { StatusBar } from "expo-status-bar";
import { WeatherPage } from "./src/screens/WeatherPage/WeatherPage";
import { View } from "react-native";

export default function App() {
  return (
    <>
      <WeatherPage />
      <StatusBar style="auto" />
    </>
  );
}
