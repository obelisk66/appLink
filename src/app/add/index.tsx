import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons,  } from "@expo/vector-icons";
import { linkStorage } from "../storage/link-storage";

import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { LinkStorage } from "@/storage/link-storage";

import { router } from "expo-router";
import { Categories } from "@/components/categories";
import { Input } from "@/components/input/index";
import { Button } from "@/components/button/";
import { useState } from "react";

export default function Add() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  async function handleAdd() {
    try {
      if (!category) {
        return Alert.alert("Categoria", "Selecione uma categoria");
      }
      if (!name.trim()) {
        return Alert.alert("Nome", "informe o nome");
      }
      if (!url.trim()) {
        return Alert.alert("URL", "Digite uma URL");
      }
      await linkStorage.save({
        id: new Date().getTime().toString(),
        name,
        url,
        category,
      })

      Alert.alert("Sucesso","Novo link adicionado",[
        {
          text:"Ok", 
          onPress: () => router.back(),},
      ])
    } catch (error) {
      Alert.alert("Error", "Não foi possível salvar o link");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={32} color={colors.gray[200]} />
        </TouchableOpacity>

        <Text style={styles.title}>Novo</Text>
      </View>

      <Text style={styles.label}>Selecione uma categoria</Text>
      <Categories onChange={setCategory} selected={category} />

      <View style={styles.form}>
        <Input placeholder="Nome" onChangeText={setName} />
        <Input placeholder="URL" onChangeText={setUrl} autoCapitalize="none" />

        <Button title="Adicionar" onPress={handleAdd} />
      </View>
    </View>
  );
}
