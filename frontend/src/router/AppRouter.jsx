import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import CarPlateAdd from "../pages/CarPlateAdd";
import PlateList from "../pages/PlateList"

const AppRouter = () =>{
    return (
        <Router>
            <Routes>
                <Route path = "" element={<Dashboard/>}>

                    <Route index element={<Home/>}/>
                    <Route path="plaka-ekle" element={<CarPlateAdd/>}/>
                    <Route path="plaka-listesi" element={<PlateList/>}/>

                </Route>
            </Routes>
        </Router>
    )
}
export default AppRouter;