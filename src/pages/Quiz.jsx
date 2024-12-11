import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import qs from "../q.js";

function Option({handleClick, text, id}){
    return (
        <>
            <p onClick={handleClick} data-key={id}>{text}</p>
        </>
    );
}

function Progress({results, currentIndex}){
    return (
        <>
            <p>
                { results.map( (v,i)=>{
                    if( currentIndex <= i ){
                        return "・"
                    }else{
                        return v ? "〇" : "×"
                    }
                })}
            </p>
        </>
    );
}

export default function Quiz(){
    // 現在の問題番号
    const [currentIndex, setCurrentIndex] = useState(0);
    // 出題一覧[{word,definition}]
    const [quizSet, setQuizSet] = useState(generateQuizSet());
    // 選択肢(出題一覧のインデックス)の配列
    const [optionSet, setOptionset] = useState(generateOptionSet());
    // ステート：リザルト画面か？
    const [result, setResult] = useState(false);
    // 正答・誤答の配列
    const [results, setResults] = useState(Array(10).fill(false));
    
    //　スタートページへのナビゲート
    const navigate = useNavigate();
    const handleClickBackToStart = () => {
      navigate("/");
    };

    // 出題一覧を生成
    function generateQuizSet () {
        let arrayOfIndex = Array.from({length:10}, (_,i)=>i);
        let newQuizSet = [];
        for(let i = 0; i < 10; i++){
            let randomIndex = Math.floor( Math.random() * arrayOfIndex.length );
            let indexToPush = arrayOfIndex.splice(randomIndex,1)[0];
            newQuizSet.push( qs[indexToPush] );
        }
        return newQuizSet;
    };
    // 選択肢を生成
    function generateOptionSet(){
        let arrayOfIndex = Array.from({length:10}, (_,i)=>i);
        let newOptionSet = [];
        for(let i = 0; i < 4; i++){
            let randomIndex = Math.floor( Math.random() * arrayOfIndex.length );
            let indexToPush = arrayOfIndex.splice(randomIndex,1)[0];
            newOptionSet.push( indexToPush );
        }
        //正答を挿入
        if( !newOptionSet.includes(currentIndex) ){
            newOptionSet[ Math.floor( Math.random() * 4 ) ] = currentIndex;
        }
        console.log(newOptionSet);
        return newOptionSet;
    }

    // 選択肢のクリックイベント
    function handleClickOption(e){
        console.log("clicked on : "+ e.target.dataset.key);
        console.log("currentindex : "+ currentIndex);

        let isCorrect = false;
        if(e.target.dataset.key == currentIndex)
        {
            isCorrect = true;
        }
        setResults(()=>{
            let newResults = [...results];
            newResults[currentIndex] = isCorrect;
            return newResults;
        });
        
        if(currentIndex == 9){
            setResult(true);
            return;
        }
        
        setCurrentIndex(currentIndex + 1);
    }
    
    // 初期処理
    useEffect(()=>{
        console.log(quizSet);
        console.log(results);
        console.log(optionSet);
    },[]);

    // インデックスが進行
    useEffect(()=>{
        setOptionset(generateOptionSet());
    }, [currentIndex]);




    return (
      <>
        {!result ? 
            <>
                <p>index : {currentIndex}</p>
                <Progress results={results} currentIndex={currentIndex}/>
                <h1>{quizSet[currentIndex].word}</h1>
                { optionSet.map( (v,i)=>{ return <Option key={i} id={v} text={quizSet[v].definition} handleClick={handleClickOption} /> } ) }
            </>
        : null }
        {result ? 
            <>
                <h1>result</h1>
                <Progress results={results} currentIndex={currentIndex+1}/>
                <button onClick={handleClickBackToStart}>戻る</button>
            </>
         : null} 
      </>
    );
  };