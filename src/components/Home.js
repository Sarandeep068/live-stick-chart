import React, { useEffect, useState } from 'react';

let setLocalStorageData

const Home = () => {
    const [stocksData, setStocksData] = useState([]);

    setLocalStorageData = () => {
        window.localStorage.setItem("historic", JSON.stringify(stocksData));
    }

    useEffect(() => {
        if(window.navigator.onLine) {
            fetch('http://kaboom.rksv.net/api/historical')
            .then(response => response.json())
            .then(data => {
                const newData = data.map(historicData => {
                    const splitString = historicData.split(",");
                    return {
                        date: new Date(parseInt(splitString[0], 10)).toDateString(),
                        open: parseFloat(splitString[1]),
                        high: parseFloat(splitString[2]),
                        low: parseFloat(splitString[3]), 
                        close: parseFloat(splitString[4]),
                        timestamp: parseInt(splitString[0], 10)
                    }
                }).sort((historicData1, historicData2) => historicData2.timestamp - historicData1.timestamp);
                setStocksData(newData);
            })
        } else {
            const storedData = JSON.parse(localStorage.getItem("historic"));
            setStocksData(storedData);
        }

        window.onbeforeunload = () => {
            setLocalStorageData();
        }

        return () => {
            setLocalStorageData();
        }
    }, [])

    return (
        <div className="home-screen-container">
            <div className="home-screen-cards-container">
                {stocksData && stocksData.length
                    ? stocksData.map((stockData, index) => {
                        return (
                            <div className="home-screen-card" key={`${stockData.timestamp}_${index}`}>
                                <span> Date: {stockData.date}</span>
                                <div className="home-screen-card-stock">
                                    <span className="home-screen-card-details">OPEN: {stockData.open}</span>
                                    <span className="home-screen-card-details">CLOSE: {stockData.close}</span>
                                    <span className="home-screen-card-details">HIGH: {stockData.high}</span>
                                    <span className="home-screen-card-details">LOW: {stockData.low}</span>
                                </div>
                            </div>
                        )
                    })
                    : <div>Loading...</div>
                }
            </div>
        </div>
    )
}

export default Home;
