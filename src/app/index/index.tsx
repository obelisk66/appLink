import{useState, useEffect} from "react"
import { 
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Text ,
  Alert
} from "react-native"
import{router} from "expo-router"

import {MaterialIcons} from "@expo/vector-icons"
import{Link} from "@/components/link"
import {style} from "./style"
import{Option} from  "@/components/option"

import {colors} from "@/styles/colors"
import { Categories } from "@/components/categories"
import{categories} from "@/utils/categories"
import{linkStorage, LinkStorage} from "@/app/storage/link-storage"



export default function Index(){
  const [links,setLinks] = useState<LinkStorage[]>([])
  const[category,setCategory] = useState(categories[0].name)

    async function getLinks() {
      try{
        const response = await linkStorage.get()
        setLinks(response)
      }catch(error){
         Alert.alert("Error","Não foi possível listar os links")
      }
    }

    useEffect(() => {
      getLinks()
    },[category])

    return(
        <View style= {style.container}>
         <View style = {style.header}>
         <Image source = {require("@/assets/logo.png")}style = {style.logo}/>

         <TouchableOpacity onPress={()=> router.navigate("./add")}>
          <MaterialIcons name = "add" size = {32} color = {colors.green[300]}/>
         </TouchableOpacity>
          </View>


          <Categories onChange={setCategory} selected ={category}/>
          
          <FlatList
          data={links}
          keyExtractor={item=>item.id}
          renderItem={({item})=>(
          <Link 
            name={item.name}
             url={item.url}

            onDetails={()=> console.log("Clicou!")}/>)}
          style={style.links}
          contentContainerStyle={style.linksContent}
          showsVerticalScrollIndicator={false}
          />
          <Modal transparent visible={false}>
            <View style={style.modal}>
              <View style={style.modalContent}>
               <View style={style.modalHeader}>
                <Text style={style.modalCategory}>curso</Text>
                <TouchableOpacity>
                <MaterialIcons name="close" size={20} color={colors.gray[400]}/>
                </TouchableOpacity>

               </View>
               <Text style={style.modalLinkName}>
                Rockseat
               </Text>
               <Text style={style.modalUrl}>
                    http://www.rocketseat.com.br
               </Text>
               <View style={style.modalFooter}>
                <Option name="Excluir" icon="delete" variant="secondy"/>
                <Option name="abrir" icon="language"/>
               </View>
              </View>
              
            </View>
          </Modal>
         </View> 
    )
}
