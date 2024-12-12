import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
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

function ResultList({results, quiz}){
    return(
        <>
            {
                quiz.map((v,i)=>{
                  return <p key={i}>{`${results[i]?"〇":"×"} : ${v.word} : ${v.definition}`}</p>  
                })
            }
        </>
    );
}

export default function Quiz({route, num = 10, quiz}){
    const location = useLocation();
    if(location.state != undefined){
        num = location.state.num ? location.state.num : num;
        quiz = location.state.quiz ? location.state.quiz : quiz;
        location.state = undefined;
    }

    // (async function testfetch(){ 
    //     const url = 'https://wordsapiv1.p.rapidapi.com/words/?random=true';
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'x-rapidapi-key': '39ee9a1cb0msha51bcc68aa46a4dp1a6309jsn2f9725ab872c',
    //             'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
    //         }
    //     };
        
    //     try {
    //         const response = await fetch(url, options);
    //         const result = await response.text();
    //         console.log(result);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // })();

    //出題数
    //const [numQuiz, setNumQuiz] = useState(num);
    // 現在の問題番号
    const [currentIndex, setCurrentIndex] = useState(0);
    // 出題一覧[{word,definition}]
    const [quizSet, setQuizSet] = useState(quiz?quiz:generateQuizSet(num));
    // 選択肢(出題一覧のインデックス)の配列
    let optionSet = generateOptionSet(currentIndex);
    // ステート：リザルト画面か？
    const [result, setResult] = useState(false);
    // 正答・誤答の配列
    const [results, setResults] = useState(generateResults(quizSet.length));

    //　スタートページへのナビゲート
    const navigate = useNavigate();
    const handleClickBackToStart = () => {
      navigate("/");
    };

    function generateResults ( num ) {
        return Array(num).fill(false);
    }

    // 出題一覧を生成
    function generateQuizSet (num) {
        let arrayOfIndex = Array.from({length:num}, (_,i)=>i);
        let newQuizSet = [];
        for(let i = 0; i < num; i++){
            let randomIndex = Math.floor( Math.random() * arrayOfIndex.length );
            let indexToPush = arrayOfIndex.splice(randomIndex,1)[0];
            newQuizSet.push( qs[indexToPush] );
        }
        return newQuizSet;
    };
    // 選択肢を生成
    function generateOptionSet( index ){
        let arrayOfIndex = Array.from({length:quizSet.length}, (_,i)=>i);
        let newOptionSet = [];
        for(let i = 0; i < Math.min(4, quizSet.length); i++){
            let randomIndex = Math.floor( Math.random() * arrayOfIndex.length );
            let indexToPush = arrayOfIndex.splice(randomIndex,1)[0];
            newOptionSet.push( indexToPush );
        }
        //正答を挿入
        if( !newOptionSet.includes(index) ){
            newOptionSet[ Math.floor( Math.random() * 4 ) ] = index;
        }
        return newOptionSet;
    }

    // 選択肢のクリックイベント
    function handleClickOption(e){
        console.log("clicked on : "+ e.target.dataset.key);

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
        
        if(currentIndex == quizSet.length-1){
            setResult(true);
            return;
        }
        
        setCurrentIndex((i)=>i + 1);
    }

    function handleClickRevenge(e){
        let newQuiz = [];
        for(let i = 0; i < quizSet.length; i++){
            if(results[i]) continue;
            newQuiz.push(quizSet[i]);
        }
        setCurrentIndex((i)=>0);
        //setNumQuiz((n)=>newQuiz.length);
        setQuizSet(newQuiz);
        setResults(generateResults(newQuiz.length));
        setResult(false);

        //navigate("/quiz", {state:{num:10, quiz:undefined}});
    }
    
    // test
    // useEffect(()=>{
    //     console.log("quizSet : " + JSON.stringify(quizSet));
    //     console.log("results : " + JSON.stringify(results));
    //     console.log("optionSet : " + JSON.stringify(optionSet));
    // },[]);

    // インデックスが進行
    // useEffect(()=>{
    // }, [currentIndex]);

    return (
      <>
        {!result ? 
            <>
                <p>index : {currentIndex}</p>
                <Progress results={results} currentIndex={currentIndex}/>
                <h1>{quizSet[currentIndex].word}</h1>
                { optionSet.map( (v,i)=>{ 
                    console.log("rendering options : " + v + " " + i);
                    return <Option key={i} id={v} text={quizSet[v].definition} handleClick={handleClickOption} /> 
                } ) }
            </>
        : null }
        {result ? 
            <>
                <h1>result</h1>
                <Progress results={results} currentIndex={currentIndex+1}/>
                <ResultList results={results} quiz={quizSet}/>
                <button onClick={handleClickBackToStart}>戻る</button>
                {
                    results.includes(false) ? <button onClick={handleClickRevenge}>間違えた問題をリトライ</button> : null
                }
            </>
         : null} 
      </>
    );
  };