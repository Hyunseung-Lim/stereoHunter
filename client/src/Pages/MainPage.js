import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import { MainNavbar } from '../Components/Navbar/mainNavbar';
import { Historybar } from '../Components/Historybar/historybar';

export const MainPage = (props) => {
  const [profileData, setProfileData] = useState({'name':null})
  const [inputData, setInputData] = useState("");
  const [situationData, setSituationData] = useState("");
  const [dialogeData, setDialogeData] = useState("\"대사가 여기에 출력됩니다\"");
  const [logData, setLogData] = useState([{'id': '', 'input': '', 'output': ''}]);
  
  const inputHandler = (e) => {
    setInputData(e.target.value);
  }

  function getData() {
    axios({
      method: "GET",
      url:"/profile",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      setProfileData(({
        name: res.name
      }))
      setLogData(
        res.logData
      )
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  useEffect(() => {
    getData()
  }, []);

  function sendRequest() {
    setDialogeData("로딩중...")
    axios({
      method: "POST",
      url:"/getInput",
      headers: {
        Authorization: 'Bearer ' + props.token
      },
      data: { inputData: inputData }
    })
    .then((response) => {
      const res =response.data
      setDialogeData((
        "\"" + res.result + "\""
      ))
      setLogData(
        res.logData
      )
    })
    setSituationData("상황: " + inputData)
  }
    
  const handleOnKeyPress = e => {
    e.preventDefault();
    if (e.key === 'Enter') {
      sendRequest();
    }
  };

  return (
    <div className='mainPage'>
      <MainNavbar name={profileData.name} removeToken={props.removeToken}/>
      <div className='container'>
        <div className='playContents'>
          <div className='inputWindow'>
            <div className='inputWindowTitle'>상황을 입력해주세요.</div>
            <input className='input' value={inputData} onChange={inputHandler} onKeyPress={handleOnKeyPress}></input>
          </div>
          <div className='outputWindow'>
            <div className='situation'>
              {situationData}
            </div>
            <div className='dialoge'>
              {dialogeData}
            </div>
          </div>
        </div>
        <Historybar logData={logData}/>        
      </div>
    </div>
  );
};