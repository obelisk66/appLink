import { useState, useCallback } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  Alert,
  Linking,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "@/components/link";
import { style } from "./style";
import { Option } from "@/components/option";

import { colors } from "@/styles/colors";
import { Categories } from "@/components/categories";
import { categories } from "@/utils/categories";
import { linkStorage, LinkStorage } from "@/app/storage/link-storage";
import { openURL } from "expo-linking";

export default function Index() {
  const[showModal, setShowModal] = useState(false)
  const[link, setLink] =useState<LinkStorage>({} as LinkStorage)
  const [links, setLinks] = useState<LinkStorage[]>([]);
  const [category, setCategory] = useState(categories[0].name);

  async function getLinks() {
    try {
      
      const response = await linkStorage.get();

      const filtered = response.filter((link) =>link.category === category)  


      setLinks(filtered);
    } catch (error) {
      Alert.alert("Error", "Não foi possível listar os links");
    }
  }
  function handleDetails(selected: LinkStorage){
    setShowModal(true)
    setLink(selected)
  }

async function linkRemove() {
try{
 await linkStorage.remove(link.id)
 getLinks()
 setShowModal(false)

} catch (error){
  Alert.alert("Error","Não foi possível Excluir")
}
  
}


async function handleRemove(){
  
   Alert.alert("Excluir","Deseja Realmente excluir?",[
    { style : "cancel", text:"Não"},
    {text: "Sim" , onPress: () => linkRemove},

   ])
   
}

async function handleOpen() {
  try{
   await Linking.openURL(link.url)
   setShowModal(false)
  }catch (error){
    Alert.alert("link","Não foi possível abrir o link ")

  }
}

 useFocusEffect(useCallback(() => {
  getLinks()
 },[category]))

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image source={require("@/assets/logo.png")} style={style.logo} />

        <TouchableOpacity onPress={() => router.navigate("./add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>

      <Categories onChange={setCategory} selected={category} />

      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={style.links}
        contentContainerStyle={style.linksContent}
        showsVerticalScrollIndicator={false}
      />
      <Modal transparent visible={showModal} animationType="slide">
        <View style={style.modal}>
          <View style={style.modalContent}>
            <View style={style.modalHeader}>
              <Text style={style.modalCategory}>{link.category}</Text>
              <TouchableOpacity onPress={() =>setShowModal(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>

            <Text style={style.modalLinkName}>{link.name}</Text>
            <Text style={style.modalUrl}>{link.url}</Text>

            <View style={style.modalFooter}>
              <Option name="Excluir" icon="delete" variant="secondy" onPress={handleRemove}/>
              <Option name="abrir" icon="language" onPress={handleOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
