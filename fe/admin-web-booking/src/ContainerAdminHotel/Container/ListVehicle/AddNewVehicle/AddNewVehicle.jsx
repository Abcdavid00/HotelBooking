import React, { useEffect, useState } from "react";
import "./addnewvehicle.scss";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {  AddNewVehicleInHotel } from "./apiAddNewVehicle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { storage } from "../../../../configFirebase/config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

const AddNewVehicle = ({ title, inputs }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.global);
  const [formData, setFormData] = useState({});
  const [dataExcel, setDataExcel] = useState([]);
  const [listImage, setListImage] = useState([]);


  const handleAddListImage = async(file) => {
    //listImage have id, img
    const listImageTemp = [...listImage];
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
     await uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(
          storage,
          `/${userInfo.idHotel}/${file[i].name}`
        );
       await getDownloadURL(pathReference).then((url) => {
          listImageTemp.push(url);
        });
      });
    }
    setListImage(listImageTemp);
    // 'file' comes from the Blob or File API
  };

  const handleAddListImageExcel = async(file, index) => {
    //listImage have id, img
    let listImageTemp = [...listImage];
    console.log(listImageTemp[index]);
    for (let i = 0; i < file.length; i++) {
      const storageRef = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
      await uploadBytes(storageRef, file[i]).then(async(snapshot) => {
        const pathReference = ref(storage, `/${userInfo.idHotel}/${file[i].name}`);
       await getDownloadURL(pathReference).then((url) => {
            listImageTemp[index].img.push(url);
        });
      })
    }
    setListImage(listImageTemp);
    // 'file' comes from the Blob or File API
  };

  useEffect(() => {
    setFormData({ ...formData, hotel_id: userInfo.idHotel });
  }, []);

  const handleChangeInput = (e) => {
    const { id, value } = e.target;
    if (id === "price") {
      let price = parseInt(value);
      setFormData({ ...formData, [id]: price });
    } else {
      if(id==="max_power"||id==="Fuel"||id==="speed_4s"||id==="speed_max"){
        setFormData({ ...formData, "specification":{...formData.specification,[id]:value} });
        return;
      }
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleImportExcel = () => {
    setListImage([]);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workBook = XLSX.read(data, { type: "array" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const dataExcel = XLSX.utils.sheet_to_json(workSheet);
        //add field image
        let listImageTemp = [...listImage];
        setDataExcel(dataExcel);
        dataExcel.forEach((item,index) => {
          let urlExcel = {
            id: index,
            img: [],
          };
          listImageTemp.push(urlExcel);
        });
        setListImage(listImageTemp);
      };
    };
    input.click();
  };

  const handleSaveDataExcel = async() => {
    const dataExcelTemp = [...dataExcel];
    const listImageTemp = [...listImage];
    console.log(dataExcelTemp);
   await dataExcelTemp.forEach(async(item,index) => {
      const data = {
        ...item,
        hotel_id: userInfo.idHotel,
        image: listImageTemp[index].img,
      };
      const res = await AddNewVehicleInHotel(data);
    });
    navigate("/listvehicle");
  };

  const handleDeleteImage = (img) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp.findIndex((item) => item === img);
    const match = img.match(/\/o\/(.+?)\?/);
    let imagePath = "";
    if (match) {
      imagePath = decodeURIComponent(match[1]);
    }
    const desertRef = ref(storage, `/${imagePath}`);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    listImageTemp.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleDeleteImageExcel =async (img,indexDelete) => {
    const listImageTemp = [...listImage];
    const index = listImageTemp[indexDelete].img.findIndex((item) => item === img);
    const match = img.match(/\/o\/(.+?)\?/);
    let imagePath = "";
    if (match) {
      imagePath = decodeURIComponent(match[1]);
    }
    const desertRef = ref(storage, `/${imagePath}`);
    // Delete the file
   await deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    listImageTemp[indexDelete].img.splice(index, 1);
    setListImage(listImageTemp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      image: listImage,
    };
    const res = await AddNewVehicleInHotel(data);
    navigate("/listvehicle");
  };


  return (
    <div className="new">
      <div className="container">
        <div className="top">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px",
            }}
          >
            <h1>{title}</h1>
            <button className="buttonImport" onClick={handleImportExcel}>
              Import Excel
            </button>
          </div>
          {dataExcel.length > 0 ? (
            <div>
              {dataExcel.map((item, index) => (
                <div className="bottom">
                  <div className="left">
                    <div className="listImageContainer">
                      <div className="content">
                        {listImage[index]&&
                        listImage[index].img.map((img) => (
                          <div className="item">
                            <img src={img} alt="" className="imgList" />
                            <ClearOutlinedIcon
                              onClick={() => {
                                handleDeleteImageExcel(img,index);
                              }}
                              className="divDelete"
                            />
                          </div>
                        ))}
                        <label htmlFor={`listImage${index}`}>
                          <AddPhotoAlternateIcon className="iconAdd" />
                          <input
                            type="file"
                            id={`listImage${index}`}
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleAddListImageExcel(e.target.files,index);
                              }
                            }}
                            style={{ display: "none", cursor: "pointer" }}
                            multiple
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <form onSubmit={handleSubmit}>
                      {inputs.map((input) => (
                        <div className="formInput" key={input.id}>
                          <label>{input.label}</label>
                          <input
                            type="text"
                            id={input.id_input}
                            value={
                              input.id_input !== "hotel_id"
                                ? item[input.id_input] || ""
                                : userInfo.idHotel
                            }
                            placeholder={input.placeholder}
                            onChange={(e) => {
                              const newItem = { ...item };
                              newItem[input.id_input] = e.target.value;
                              const newData = [...dataExcel];
                              newData[index] = newItem;
                              setDataExcel(newData);
                            }}
                          />
                        </div>
                      ))}
                      <div className="formInput">
                    <label>Specification</label>
                    <input
                    type={"text"}
                    id={"max_power"}
                    value={formData["specification"]&&formData["specification"]["max_power"] || ""}
                    placeholder={"Max Power"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"Fuel"}
                    value={formData["specification"]&&formData["specification"]["Fuel"] || ""}
                    placeholder={"Fuel"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"speed_4s"}
                    value={formData["specification"]&&formData["specification"]["speed_4s"] || ""}
                    placeholder={"Speed 4s"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"speed_max"}
                    value={formData["specification"]&&formData["specification"]["speed_max"] || ""}
                    placeholder={"Speed Max"}
                    onChange={handleChangeInput}
                    />
                  </div>
                    </form>
                  </div>
                </div>
              ))}
              <button className="buttonExcel" onClick={handleSaveDataExcel}>Save</button>
            </div>
          ) : (
            <div className="bottom">
              <div className="left">
                <div className="listImageContainer">
                  <div className="content">
                    {listImage.map((img) => (
                      <div className="item">
                        <img src={img} alt="" className="imgList" />
                        <ClearOutlinedIcon
                          onClick={() => {
                            handleDeleteImage(img);
                          }}
                          className="divDelete"
                        />
                      </div>
                    ))}
                    <label htmlFor="listImage">
                      <AddPhotoAlternateIcon className="iconAdd" />
                      <input
                        type="file"
                        id="listImage"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleAddListImage(e.target.files);
                          }
                        }}
                        style={{ display: "none", cursor: "pointer" }}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  {inputs.map((input) => (
                    <div className="formInput" key={input.id}>
                      <label>{input.label}</label>
                      <input
                        type={input.type}
                        id={input.id_input}
                        value={
                          input.id_input !== "hotel_id"
                            ? formData[input.id_input] || ""
                            : userInfo.idHotel
                        }
                        placeholder={input.placeholder}
                        onChange={handleChangeInput}
                      />
                    </div>
                  ))}
                  <div className="formInput">
                    <label>Specification</label>
                    <input
                    type={"text"}
                    id={"max_power"}
                    value={formData["specification"]&&formData["specification"]["max_power"] || ""}
                    placeholder={"Max Power"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"Fuel"}
                    value={formData["specification"]&&formData["specification"]["Fuel"] || ""}
                    placeholder={"Fuel"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"speed_4s"}
                    value={formData["specification"]&&formData["specification"]["speed_4s"] || ""}
                    placeholder={"Speed 4s"}
                    onChange={handleChangeInput}
                    />
                    <input
                    type={"text"}
                    id={"speed_max"}
                    value={formData["specification"]&&formData["specification"]["speed_max"] || ""}
                    placeholder={"Speed Max"}
                    onChange={handleChangeInput}
                    />
                  </div>
                  <button className="buttonSave">Save</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewVehicle;
