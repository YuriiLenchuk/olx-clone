"use client";
import {useEffect} from "react";

export default function Cart () {
    useEffect(() => {
        fetch('http://localhost:3005/customer').then((data) => data.json()).then((data) => console.log(data))
    }, []);
    return <div>Hello</div>
};


