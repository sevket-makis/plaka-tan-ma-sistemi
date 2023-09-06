import React, { useState } from 'react'
import "./style.css";
import { useNavigate } from 'react-router-dom';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import firebase from "../firebase/firebase"
import { TextField } from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import { toastSuccessNotify,toastErrorNotify } from '../helper/ToastNotify';


const CarPlateAdd = () => {
  const initialValues = {
    mod: "",
    plaka: "",
  }
  const [newPlate, setNewPlate] = useState(initialValues);
  const navigate = useNavigate();
  const db =getFirestore(firebase);

const handleChange = (e) =>{
  e.preventDefault();
  const{name,value} = e.target;
  setNewPlate({...newPlate,[name]:value})


}
const handleSubmit = ()=>{

  addPlate();


}
  const addPlate = async () => {
    try {
      const plateCol = collection(db, 'plates');
      await addDoc(plateCol, newPlate);
  toastSuccessNotify("Ekleme başarılı");
  setNewPlate("");
 
     
  
    } catch (error) {
      toastErrorNotify("Hatalı işlem. Tekrar deneyiniz")
    }
  };


  return (
    <> 
    <div className='plate-add-p'><p>MAK-İŞ PLAKA TANIMA SİSTEMİ ARAÇ EKLEME</p></div>

    <div className='plate-add-div-container'> 
    <h3>ARAÇ EKLE</h3> 
    <div className='plate-add-div'>
    
    <div className="textfield-div-label"> 
    <InputLabel htmlFor="name-input">PLAKA</InputLabel>
<TextField 
variant='outlined'
name="plaka"
value={newPlate?.plaka || ""}
onChange={handleChange}
placeholder='Plaka Giriniz'
required
className="textfield-add"
/>
</div>
   


<div className="textfield-div-label"><InputLabel htmlFor="name-input">STATÜ</InputLabel>
<TextField 
variant='outlined'
name="mod"
value={newPlate?.mod || ""}
onChange={handleChange}
placeholder='Statü Giriniz'
required
className="textfield-add"
/></div>

    </div>


    <div className='plate-add-button-div'>
      <button className='btn_add' onClick={handleSubmit}>Ekle</button>
      <button className='btn_home' onClick={()=> navigate("/")}>Ana Sayfa</button>
    
    </div></div>
  
    </>
   
  )
}

export default CarPlateAdd