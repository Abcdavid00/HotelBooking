import { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import avatar from "../../../assets/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { DeleteRoomInHotel, DeleteVehicleInHotel, updateStatusInOrder } from "./apiDataTable";

const DataTable = (props) => {
  const { data, setReload } = props;
  const navigate = useNavigate();
  const { stateSidebar } = useSelector((state) => state.global);
  const [selectionModel, setSelectionModel] = useState([]);
  var dataTitle = {};
  switch (stateSidebar) {
    case "rooms":
      dataTitle = {
        title: "List Room",
        path: "/listroom/new",
        pathEdit: "/listroom/edit/:roomId",
      };
      break;
    case "Bookings":
      dataTitle = {
        title: "List Booking",
        path: "/listbooking/:bookingId",
      };
      break;
    case "Vehicles":
      dataTitle = {
        title: "List Vehicle",
        path: "/listvehicle/new",
        pathEdit: "/listvehicle/edit/:vehicleId",
      }
    default:
      break;
  }


  const handleColumnsVehicle = () => {
     return [
    { field: "id", headerName: "ID", width: 170 },
    { field: "hotel_id", headerName: "Hotel ID", width: 110 },
    { field: "name", headerName: "Name", width: 150 },
    {field:"brand",headerName:"Brand",width:150},
    {field:"price",headerName:"Price",width:150},
    {field:"specification",headerName:"Specification",width:280},
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              src={params.row.image || avatar}
              alt="avatar"
              className="cellImg"
            />
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        const handleEdit = () => {
          navigate(`/listvehicle/edit/${params.row.id}`, {
            state: {
              id: params.row.id,
              name: params.row.name,
              brand: params.row.brand,
              description: params.row.description,
              specification: params.row.specification,
              price: params.row.price,
              image: params.row.image,
              hotel_id: params.row.hotel_id,
            },
          });
        };
        return (
          <div className="action">
            <div
              className="btnEdit"
              onClick={() => {
                handleEdit();
              }}
            >
              Edit
            </div>
          </div>
        );
      },
    },
     ]
  }


  const handleAddRowsVehicle = () => {
    var rows = [];
    data.map((item) => {
      let arr=[];
      arr.push(item.specification[0].max_power);
      arr.push(item.specification[0].Fuel);
      arr.push(item.specification[0].speed_4s);
      arr.push(item.specification[0].speed_max);
      rows.push({
        id: item._id,
        name: item.name,
        brand: item.brand,
        description: item.description,
        specification: arr,
        price: item.price,
        image: item.image,
        hotel_id: item.hotel_id,
      });
    });
    return rows;
  };


  const handleColumnsBooking = () => {
    return [
      { field: "id", headerName: "ID", width: 170 },
      { field: "customer", headerName: "Customer", width: 110 },
      {
        field: "room_name",
        headerName: "Room",
        width: 260,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img
                src={params.row.image || avatar}
                alt="avatar"
                className="cellImg"
              />
              <span>{params.row.room_name}</span>
            </div>
          );
        },
      },
      { field: "check_in", headerName: "Check In", width: 110 },
      {
        field: "check_out",
        headerName: "Check Out",
        width: 110,
      },
      { field: "cost", headerName: "Cost", width: 100 },
      { field: "payment_method", headerName: "Payment Method", width: 180 },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params) => {
          return (
            <div>
              <span className={`status ${params.row.status}`}>
                {params.row.status}
              </span>
            </div>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => {
          const handleView = () => {
            navigate(`/listbooking/${params.row.id}`);
          };
          return (
            <div className="action">
              <div
                className="btnEdit"
                onClick={() => {
                  handleView();
                }}
              >
                View
              </div>
            </div>
          );
        },
      },
    ];
  };

  const paymentAdapter = (method) => {
    if (method === "payment-hotel") {
      return "Payment at hotel";
    } else if (method === "payment-online") {
      return "Payment online";
    }
  };

  const handleAddRowsBooking = () => {
    var rows = [];
    data.map((item) => {
      rows.push({
        id: item._id,
        customer: item.id_user.name,
        room_name: item.id_room.name,
        cost: item.total,
        image: item.id_room.image[0],
        check_in: item.check_in,
        check_out: item.check_out,
        payment_method: paymentAdapter(item.payment_method),
        status: item.status,
      });
    });
    return rows;
  };

  const handleColumnsRoom = () => {
    return [
      { field: "id", headerName: "ID", width: 170 },
      { field: "hotel_id", headerName: "Hotel ID", width: 110 },
      {
        field: "name",
        headerName: "Name",
        width: 250,
      },
      { field: "description", headerName: "Description", width: 200 },
      {
        field: "price",
        headerName: "Price",
        width: 100,
      },
      { field: "utility", headerName: "Utility", width: 170 },
      {
        field: "image",
        headerName: "Image",
        width: 100,
        renderCell: (params) => {
          return (
            <div className="cellWithImg">
              <img
                src={params.row.image || avatar}
                alt="avatar"
                className="cellImg"
              />
            </div>
          );
        },
      },
      {
        field: "action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => {
          const handleEdit = () => {
            navigate(`/listroom/edit/${params.row.id}`, {
              state: {
                id: params.row.id,
                name: params.row.name,
                description: params.row.description,
                price: params.row.price,
                image: params.row.image,
                isactive: params.row.isactive,
                utility: params.row.utility,
                hotel_id: params.row.hotel_id,
                tag: params.row.tag,
              },
            });
          };
          return (
            <div className="action">
              <div
                className="btnEdit"
                onClick={() => {
                  handleEdit();
                }}
              >
                Edit
              </div>
            </div>
          );
        },
      },
    ];
  };

  const handleAddRowsRoom = () => {
    var rows = [];
    data.map((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        isactive: item.isactive,
        utility: item.utility,
        hotel_id: item.hotel_id,
        tag: item.tag,
      });
    });
    return rows;
  };

  const deleteRoom = async () => {
    for (let i = 0; i < selectionModel.length; i++) {
      const res = await DeleteRoomInHotel(selectionModel[i]);
    }
    setReload(true);
  };
  const deleteVehicle = async () => {
    for (let i = 0; i < selectionModel.length; i++) {
      const res = await DeleteVehicleInHotel(selectionModel[i]);
    }
    setReload(true);
  };

  const ConfirmBooking = async () => {
    for (let i = 0; i < selectionModel.length; i++) {
      const res = await updateStatusInOrder(selectionModel[i],"Completed");
    }
    setReload(true);
  }

  const CancelBooking = async () => {
    for (let i = 0; i < selectionModel.length; i++) {
      const res = await updateStatusInOrder(selectionModel[i],"Cancelled");
    }
    setReload(true);
  }
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {dataTitle.title}
        {(stateSidebar === "rooms"||stateSidebar === "Vehicles") && (
          <div style={{}}>
            <Link
              to={dataTitle.path}
              style={{ textDecoration: "none" }}
              className="link"
            >
              Add new
            </Link>
          </div>
        )}
      </div>
      {data.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={
            stateSidebar === "rooms"
              ? handleAddRowsRoom()
              : stateSidebar === "Bookings"
              ? handleAddRowsBooking()
              : stateSidebar === "Vehicles"
              ? handleAddRowsVehicle()
              : null
          }
          columns={
            stateSidebar === "rooms"
              ? handleColumnsRoom()
              : stateSidebar === "Bookings"
              ? handleColumnsBooking()
              : stateSidebar === "Vehicles"
              ? handleColumnsVehicle()
              : null
          }
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          disableVirtualization
          disableDensitySelector
          disableColumnMenu
          disableColumnSelector
          onRowSelectionModelChange={(e) => {
            setSelectionModel(e);
          }}
        />
      )}
      {selectionModel?.length > 0 && stateSidebar==="rooms" &&
        <div onClick={deleteRoom} className="delete">
          Delete
        </div>
      }
      {selectionModel?.length > 0 && stateSidebar==="Vehicles" &&
        <div onClick={deleteVehicle} className="delete"> 
          Delete
        </div>
      }
      {selectionModel?.length > 0 && stateSidebar==="Bookings"&&data.status==="Pending" &&
        <div className="statusOrder">
        <div onClick={ConfirmBooking} className="confirm">
          Confirm
        </div>
        <div onClick={CancelBooking} className="cancel">
          Cancel
        </div>
        </div>
      }
    </div>
  );
};

export default DataTable;
