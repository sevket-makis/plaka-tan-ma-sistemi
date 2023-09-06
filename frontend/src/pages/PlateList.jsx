import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from "@mui/material/TableHead"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useEffect, useState } from 'react'
import {   getFirestore,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  getDocs, } from "firebase/firestore";
import firebase from "../firebase/firebase"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import loadinglogo from "../image/loadinglogo.gif";
import InputLabel from '@mui/material/InputLabel';
import { toastErrorNotify, toastSuccessNotify } from "../helper/ToastNotify";



const PlateList = () => {
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  function CustomTablePagination(props) {
    return (
      <TablePagination
        {...props}
        labelRowsPerPage="Satır Sayısı:"
      />
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const initialValues = {

    mod: "",
    plaka: "",
  }

  const [newPlate, setNewPlate] = useState(initialValues);
  const handleChange = (e) =>{
    e.preventDefault();
    const{name,value} = e.target;
    setNewPlate({...newPlate,[name]:value})
    console.log(newPlate)
  
  }

const navigate=useNavigate();
    const db =getFirestore(firebase);
const[plate,setPlate]=useState([]);
const[open,setOpen]=useState(false);
const[idUp,setIdUp]=useState("");
const[loading,setLoading]=useState(false);
const emptyRows =
page > 0 ? Math.max(0, (1 + page) * rowsPerPage - plate.length) : 0;

const handleChangePage = (event, newPage) => {
setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
setRowsPerPage(parseInt(event.target.value, 10));
setPage(0);
};

const getPlate = async () => {
  
    try {
      const plateCol = collection(db, "plates");
      const plateSnapshot = await getDocs(plateCol);
      const plateList = plateSnapshot.docs.map(doc => ({
        id:doc.id,
        ...doc.data(),
      }));
      
      setPlate(plateList)
 setLoading(true);
      return plateList;
  
    } catch (error) {
      console.error("Hata:", error);
  
    }
  };
  const deletePlate = async (id) => {
    try {
      const plateDoc = doc(db, 'plates', id);
      await deleteDoc(plateDoc);
      toastSuccessNotify("Plaka silme başarılı")
    
     getPlate()
    } catch (error) {
      console.error('Hata:', error);
      toastErrorNotify("Hatalı işlem. Tekrar deneyiniz")
    }
  };
  const updatePlate = async (id, newPlate) => {
    console.log(id,"id")
    try {
      const plateDoc = doc(db, 'plates', id);
      await updateDoc(plateDoc, newPlate);
      toastSuccessNotify("Güncelleme başarılı")
      getPlate();
      setOpen(false);
    
    } catch (error) {
      console.error('Hata:', error);
      toastErrorNotify("Hatalı işlem. Tekrar deneyiniz")
    }
  };

useEffect(()=>{
   getPlate()
},[])






  return (
    <>  <div>
   
       {!loading && (<div className="loading-logo-div"><img src={loadinglogo} alt="logo" /> <br /> <h3>YÜKLENİYOR...</h3></div>)}
       {loading && !open&&( <>    <h1>MAK-İŞ PLAKA TANIMA SİSTEMİ KAYITLI PLAKA LİSTESİ</h1> 
       <TableContainer component={Paper} sx={{border:1,margin:"auto",marginTop:7, minWidth:700,maxWidth:1200,display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

<Table sx={{minWidth:650}} arial-label="simple table">
  <TableHead >
    <TableRow >
      <TableCell align="center" >SIRA NO</TableCell>
      <TableCell align="center">PLAKA</TableCell>
      <TableCell align="center">KİME AİT</TableCell>
      <TableCell align="center">YAPILACAK İŞLEM</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {(rowsPerPage > 0 ? plate?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):plate)?.map((item,index)=> 
    
     { 
      const{plaka,mod}=item;
      let plateNum = index + (page * rowsPerPage) + 1;

      function separateLettersAndNumbers() {
        const matches = plaka?.match(/(\d+)([a-zA-Z]+)(\d+)/);
        if (matches) {
          const firstDigits = matches[1];
          const letters = matches[2];
          const lastDigits = matches[3];
          return `${firstDigits} ${letters} ${lastDigits}`;
        }
        return plaka // Eşleşme yoksa plakayı değiştirmeyin
      }
      let formattedPlates = separateLettersAndNumbers(plaka)
     return( <>
     
     
     <TableRow key = {item.id}
      sx={{'&:last-child td, &:last-child th' : {borderBottom:1}}}
      >
        <TableCell align="center"  >{plate?.length - (plate?.length-(plateNum))}</TableCell>
        <TableCell align="center" sx={{letterSpacing:2}}>{formattedPlates?.toUpperCase()}</TableCell>
        <TableCell align="center" >{item?.mod?.toLocaleUpperCase("tr-TR")}</TableCell>
      <TableCell align="center">
        
        <div className="icon-cell"> <div>{<DeleteIcon className="delete-icon-plate" onClick={()=>deletePlate(item?.id)}/>}</div>  
        <div>{<><EditIcon  onClick={() =>
             {  setOpen(true);
           setIdUp(item.id);
           setNewPlate({plaka:item?.plaka,mod:item?.mod})
            }
              } className="edit-icon-plate"/></> }</div>
        
        </div>
       </TableCell>
      </TableRow>
   
      </>)
     
    
      }
    )}
     {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows}}>
              <TableCell colSpan={12} />
            </TableRow>
          )}
    
  </TableBody>

  
</Table>
<TableFooter>
          <TableRow   >
            <TableCell sx={{}}>
        
            <CustomTablePagination
  rowsPerPageOptions={[5,10, 25,{ label: 'Tümü', value: -1 }]}
  component="div"
  count={plate?.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  
/>
            </TableCell>

          </TableRow>
        </TableFooter>
      </TableContainer>
      <div className="btn-div"><button className="btn_home" onClick={()=>navigate("/")}>ANA SAYFA</button></div>
      </>  

      
      )}


  
   
    </div>
    {open &&  (
      <>  <h1 className="h1-text">PLAKA VE STATÜ GÜNCELLEME</h1>  <div className="update-div">   <div className="textfield-div" >
      <div className="textfield-div-label">  <InputLabel htmlFor="name-input">PLAKA</InputLabel>
<TextField 
variant='outlined'
name="plaka"
value={newPlate?.plaka || ""}
onChange={handleChange}
placeholder='Plaka Giriniz'
required
className="textfield-input"

/></div>
    <div className="textfield-div-label"><InputLabel htmlFor="name-input">STATÜ</InputLabel>

<TextField 
variant='outlined'
name="mod"
value={newPlate?.mod || ""}
onChange={handleChange}
placeholder='Statü Giriniz'
required
className="textfield-input"


/></div>

</div>

<div className="btn-div"><button className="btn_update" onClick={()=>{updatePlate(idUp, newPlate)}}>Güncelle</button></div>
<div className="btn-div"><button className="btn_home" onClick={()=>navigate("/")}>ANA SAYFA</button></div>


</div></>

 

  )}  
    </>
  
  )
}

export default PlateList