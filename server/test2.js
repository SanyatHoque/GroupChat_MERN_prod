import React, {useEffect, useState} from "react";
import "./App.css";

const App = () => {
    const APP_ID = "";
    const APP_KEY = "";

    useEffect(() => {
        getRecipes();
    },[]);

    const getRecipes = async () => {
        const response = await fetch(
            ''
        );
        const data = await response.json();
        console.log(data);
    };

    return (
        <div className="App">
            <form className="search-form">
                <input className="search-bar" type="text" />
                <button className="search-button" type="submit">
                    Search
                </button>
            </form>
        </div>
    )


}