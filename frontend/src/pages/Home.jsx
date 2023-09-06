import React, { useEffect, useState } from 'react'
import "./style.css";
import {useNavigate } from 'react-router-dom';
import logo1 from "../image/logo1.jpeg"
import Card from 'react-bootstrap/Card';
import door from "../image/door.gif";
import loadinglogo from "../image/loadinglogo.gif"
const Home = () => {
    const navigate = useNavigate();
    const [openDoor,setOpenDoor]=useState(false)
    const [plateBool,setPlateBool]=useState(false)
const[image,setImage]=useState([]);
const[plateCar,setPlateCar]=useState("")
const[mode,setMode]=useState([]);
const [loading,setLoading]=useState(false);
    useEffect(()=>{
        const fetchData = async () =>{
            try{
                const response = await fetch(`http://192.168.1.118:5000/detect?timestamp=${new Date().getTime()}`);
                if(!response.ok){ 
                    throw new Error("internet yok")
                }
                   const blob = await response.blob();
                   const url = URL.createObjectURL(blob);
                  setImage(prevImage =>url);
                setLoading(true);
            }
            catch (error){
                console.log(error)
            }
        }

        const fetchPlate = async()=>{
            try{
                const response = await fetch(`http://192.168.1.118:5000/plate?timestamp=${new Date().getTime()}`);
                if(!response.ok){ 
                    throw new Error("internet yok")
                }
                  const data = await response.json()
                  setPlateCar(data?.plate?.toLocaleUpperCase("tr-TR"))
                
            }
            catch (error){
                console.log(error)
            }
        }

        const fetchMode = async()=>{
            try{
                const response = await fetch(`http://192.168.1.118:5000/mode?timestamp=${new Date().getTime()}`);
                if(!response.ok){ 
                    throw new Error("internet yok")
                }
                  const data = await response.json()
                  setMode(data.mode)
                
            }
            catch (error){
                console.log(error)
            }
        }
        const intervalImg = setInterval(fetchData,3000);
        const intervalPlt = setInterval(fetchPlate,3000);
        const intervalMode = setInterval(fetchMode,3000);
        return() =>{
            clearInterval(intervalImg);
            clearInterval(intervalPlt);
            clearInterval(intervalMode);
        }
    },[])
  const fetchOpenDoor =async() =>{
    try{
        const response = await fetch(`http://192.168.1.121/on`);
        if(!response.ok){ 
            throw new Error("internet yok")
           
        }
         
       
    }
    catch (error){
      
        setTimeout(async()=>{
            try {
                const responseOff = await fetch("http://192.168.1.121/off");
                if(!responseOff.ok){ 
                   console.log("resp")
                  
                }
               
            } catch (error) {
                setTimeout(()=>{window.location.reload()},2000)
                console.log("error")
            }
           
        },5000)
    }
  }


  function separateLettersAndNumbers() {
    const matches = plateCar?.match(/(\d+)([a-zA-Z]+)(\d+)/);
    if (matches) {
      const firstDigits = matches[1];
      const letters = matches[2];
      const lastDigits = matches[3];
      return `${firstDigits} ${letters} ${lastDigits}`;
    }
    return plateCar // Eşleşme yoksa plakayı değiştirmeyin
  }
  const formattedPlates = separateLettersAndNumbers(plateCar)

  return (
    <div className='home-div'>
        <div className='navbar-div'>
        <img  src={logo1} className='navbar-img' alt="logo" />
        <h1>MAK-İŞ PLAKA TANIMA SİSTEMİ</h1>
        </div>
       
        <div className='button-div'>
            <button className='button-plate-add' onClick={()=> navigate("/plaka-ekle")}>Sisteme Yeni Araç Ekle</button>
            <button className='button-plate-list' onClick={()=> navigate("/plaka-listesi")}>Sistemdeki Plakaları Görüntüle</button>
            
            </div>
        <div>
            <div className='card-div'>
            <Card className='card-plate'>  
            <div className='tr-div'>TR</div>
      <Card.Body className='card-body'><p className='card-body-p'>{formattedPlates}</p></Card.Body>
    </Card>
               
               
           
            </div>
            <div className='img-card-div'>
                <Card className='card-img'>
                    {!loading && (<div className='loading-logo-div-plate'><img  src={loadinglogo} alt="plaka-resmi"/> <h5>Fotoğraf Yükleniyor...</h5></div> )}
                    {loading && (<img className='plate-image' src={image} alt="plaka-resmi" />)} 
                </Card>
              
               
            </div>
            {mode === "1" && (  <div className='open-door-card-div-true'>
                <Card  className='open-door-card-true'>
                <h2>Araç Sisteme Kayıtlı </h2>
                   
                </Card>
               
              <Card className='open-door-card'>
            <img className='open-door-img' src={door} alt="door" />
              </Card>
            </div>)}
            {plateBool && (  <div className='open-door-card-div-true'>
               
               
              <Card className='open-door-card'>
            <img className='open-door-img' src={door} alt="door" />
              </Card>
              {/* <button className='button-door-open' onClick={()=>window.location.reload()}>Yenile</button> */}
            </div>)}
          
            {mode === "0" && !plateBool && (<div className='false-div'>

            <div className='open-door-card-div-false'>
                <Card  className='open-door-card-false'> 
                <h2>!!! Araç Sisteme Kayıtlı Değil !!!</h2>
                </Card>
                </div>
                
           <div className='button-div-open-door'>
                 <button className='button-door-open' onClick={()=>{setPlateBool(true); fetchOpenDoor()}}>Kapıyı Aç</button>
                <button className='button-plate-add' onClick={()=> navigate("/plaka-ekle")}>Aracı Sisteme Kaydet</button>
               </div>
               
            </div>)}
            
                
        </div>
    </div>
  )
}

export default Home