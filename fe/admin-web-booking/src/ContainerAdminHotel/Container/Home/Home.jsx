import "./Home.scss";


import { useSelector } from "react-redux";
import RoomTable from "../../Components/table/RoomTable";
import WidgetRoom from "../../Components/widget/WidgetRoom";
import Featured from "../../../components/featured/Featured";
import Chart from "../../../components/chart/Chart";
import { useEffect, useState } from "react";
import {  GetAllOrders } from "./apiHome";
const HomeHotel = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {userInfo}=useSelector(state=>state.global)
  console.log(userInfo);
  const initFetch = async () => {
    setIsLoading(true);
    const res = await GetAllOrders();
    if (res.status === 200) {
      const data = res.data.data.filter(
        (item) => item.id_hotel === userInfo.idHotel
      );
      setData(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initFetch();
  }, []);

  return (
    <>
    {isLoading ? <></>:
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          <WidgetRoom type="order" />
          <WidgetRoom type="earning" />
          <WidgetRoom type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart
            dataChart={data}
            height={360}
            title={"Last 6 Months (Revenue)"}
          />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Orders</div>
          <RoomTable dataTable={data} />
        </div>
      </div>
    </div>
    }
    </>
  );
};

export default HomeHotel;
